import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import storage from '../services/storage';
import api from '../services/api';
import { playAlarm, stopAlarm } from '../services/alarm';
import * as Location from 'expo-location';

const generateDeviceId = () => {
    return 'device-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            deviceId: null,
            isAuthenticated: false,
            alerts: [],
            respondedAlertIds: [], // Track alerts user has responded to
            lastSeenAlertId: null, // Track the last seen alert to detect new ones
            loading: false,
            error: null,

            // Actions
            signup: async (name, email, password, phone = '') => {
                set({ loading: true, error: null });
                try {
                    let deviceId = get().deviceId;
                    if (!deviceId) {
                        deviceId = generateDeviceId();
                        set({ deviceId });
                    }

                    const fcmToken = 'dummy-fcm-token-' + Date.now();

                    // Location logic
                    let locationCoords = { type: 'Point', coordinates: [0, 0] }; // fallback
                    try {
                        let { status } = await Location.requestForegroundPermissionsAsync();
                        if (status === 'granted') {
                            let location = await Location.getCurrentPositionAsync({});
                            locationCoords = {
                                type: 'Point',
                                // Note: longitude first for MongoDB
                                coordinates: [location.coords.longitude, location.coords.latitude]
                            };
                            console.log('Location fetched:', locationCoords);
                        } else {
                            console.warn('Location permission denied, using default [0,0]');
                        }
                    } catch (locErr) {
                        console.error('Failed to get location:', locErr);
                    }

                    const response = await api.post('/auth/signup', {
                        name,
                        email,
                        password,
                        phone,
                        deviceId,
                        fcmToken,
                        platform: 'android',
                        location: locationCoords,
                    });

                    if (response.data.success) {
                        const userData = response.data.data.user;
                        const user = {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone || '',
                            profilePhoto: userData.profilePhoto || null,
                        };
                        set({
                            user,
                            deviceId: response.data.data.device?.deviceId || deviceId,
                            isAuthenticated: true,
                            loading: false,
                            respondedAlertIds: [],
                        });
                        return true;
                    } else {
                        throw new Error(response.data.message || 'Signup failed');
                    }
                } catch (err) {
                    console.error(err);
                    set({ error: err.response?.data?.message || err.message || 'Signup failed', loading: false });
                    return false;
                }
            },

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    let deviceId = get().deviceId;
                    if (!deviceId) {
                        deviceId = generateDeviceId();
                        set({ deviceId });
                    }

                    const fcmToken = 'dummy-fcm-token-' + Date.now();

                    // Location logic
                    let locationCoords = { type: 'Point', coordinates: [0, 0] }; // fallback
                    try {
                        let { status } = await Location.requestForegroundPermissionsAsync();
                        if (status === 'granted') {
                            let location = await Location.getCurrentPositionAsync({});
                            locationCoords = {
                                type: 'Point',
                                // Note: longitude first for MongoDB
                                coordinates: [location.coords.longitude, location.coords.latitude]
                            };
                            console.log('Location fetched:', locationCoords);
                        } else {
                            console.warn('Location permission denied, using default [0,0]');
                        }
                    } catch (locErr) {
                        console.error('Failed to get location:', locErr);
                    }

                    const response = await api.post('/auth/login', {
                        email,
                        password,
                        deviceId,
                        fcmToken,
                        platform: 'android',
                        location: locationCoords,
                    });

                    if (response.data.success) {
                        const userData = response.data.data.user;
                        const user = {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone || '',
                            profilePhoto: userData.profilePhoto || null,
                        };
                        set({
                            user,
                            deviceId: response.data.data.device?.deviceId || deviceId,
                            isAuthenticated: true,
                            loading: false,
                            respondedAlertIds: [],
                        });
                        return true;
                    } else {
                        throw new Error(response.data.message || 'Login failed');
                    }
                } catch (err) {
                    console.error(err);
                    set({ error: err.response?.data?.message || err.message || 'Login failed', loading: false });
                    return false;
                }
            },

            logout: () => set({ user: null, isAuthenticated: false, alerts: [], respondedAlertIds: [] }),

            updateProfile: async (name, email, phone, profilePhotoUrl) => {
                set({ loading: true, error: null });
                try {
                    const { user } = get();
                    if (!user?.id) throw new Error('Not logged in');

                    const response = await api.put(`/users/${user.id}/profile`, {
                        name,
                        email,
                        phone,
                        profilePhoto: profilePhotoUrl
                    });

                    if (response.data.success) {
                        set({
                            user: {
                                ...user,
                                name: response.data.data.name || name,
                                email: response.data.data.email || email,
                                phone: response.data.data.phone || phone,
                                profilePhoto: response.data.data.profilePhoto || profilePhotoUrl
                            },
                            loading: false
                        });
                        return true;
                    } else {
                        throw new Error(response.data.message || 'Profile update failed');
                    }
                } catch (err) {
                    console.error('Update profile error:', err);
                    set({ error: err.response?.data?.message || err.message, loading: false });
                    return false;
                }
            },

            // Update device location on the server
            updateLocation: async () => {
                try {
                    const { deviceId } = get();
                    if (!deviceId) return;

                    let { status } = await Location.getForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        const perm = await Location.requestForegroundPermissionsAsync();
                        status = perm.status;
                    }
                    if (status !== 'granted') return;

                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });

                    await api.put(`/devices/${deviceId}/location`, {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                } catch (err) {
                    console.error('Location update failed:', err.message);
                }
            },

            fetchAlerts: async (silent = false) => {
                if (!silent) {
                    set({ loading: true, error: null });
                }
                try {
                    const { deviceId, respondedAlertIds, lastSeenAlertId } = get();

                    // Update location before fetching so backend has fresh coordinates
                    await get().updateLocation();

                    // Use device-aware endpoint for geofence-filtered alerts
                    const endpoint = deviceId
                        ? `/alerts/device/${deviceId}`
                        : '/alerts';
                    const response = await api.get(endpoint);

                    if (response.data.success) {
                        // Filter out alerts user has already responded to
                        const allAlerts = response.data.data.map(alert => {
                            let parsedLocation = 'Global';
                            if (alert.targetRegion) {
                                if (typeof alert.targetRegion === 'string') {
                                    parsedLocation = alert.targetRegion;
                                } else if (alert.targetRegion.type === 'Point' && alert.targetRegion.radius) {
                                    parsedLocation = `Geofenced Area (${alert.targetRegion.radius}m radius)`;
                                }
                            }

                            return {
                                id: alert._id,
                                title: alert.title,
                                severity: alert.severity,
                                location: parsedLocation,
                                time: new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                description: alert.message
                            };
                        });

                        const activeAlerts = allAlerts.filter(a => !respondedAlertIds.includes(a.id));

                        // Check if there's a new alert we haven't seen
                        if (activeAlerts.length > 0) {
                            const newestAlertId = activeAlerts[0].id;
                            if (newestAlertId !== lastSeenAlertId) {
                                // NEW ALERT! Trigger the alarm
                                console.log('🚨 NEW ALERT DETECTED! Playing alarm...');
                                playAlarm();
                                set({ lastSeenAlertId: newestAlertId });
                            }
                        }

                        if (!silent) {
                            set({ alerts: activeAlerts, loading: false });
                        } else {
                            set({ alerts: activeAlerts });
                        }
                    }
                } catch (err) {
                    console.error(err);
                    if (!silent) {
                        set({ error: err.response?.data?.message || err.message, loading: false });
                    }
                }
            },

            // Stop the alarm (called when user responds to alert)
            dismissAlarm: () => {
                stopAlarm();
            },

            acknowledgeAlert: async (alertId) => {
                try {
                    const { deviceId } = get();
                    if (!deviceId) return;

                    await api.post('/alerts/feedback', {
                        alertId,
                        deviceId,
                        status: 'ACKNOWLEDGED',
                        metadata: { timestamp: new Date() }
                    });

                    // Add to responded list and remove from active
                    set((state) => ({
                        alerts: state.alerts.filter(a => a.id !== alertId),
                        respondedAlertIds: [...state.respondedAlertIds, alertId]
                    }));
                } catch (err) {
                    console.error('Failed to acknowledge alert:', err);
                }
            },

            // Send feedback with action type (MEDICAL, FIRE, SAFE, HELP)
            sendFeedback: async (alertId, actionType) => {
                try {
                    const { deviceId } = get();
                    if (!deviceId) return false;

                    await api.post('/alerts/feedback', {
                        alertId,
                        deviceId,
                        status: actionType,
                        metadata: {
                            timestamp: new Date(),
                            actionType
                        }
                    });

                    // Add to responded list and remove from active alerts
                    set((state) => ({
                        alerts: state.alerts.filter(a => a.id !== alertId),
                        respondedAlertIds: [...state.respondedAlertIds, alertId]
                    }));

                    return true;
                } catch (err) {
                    console.error('Failed to send feedback:', err);
                    return false;
                }
            }
        }),
        {
            name: 'aapada-storage',
            storage: createJSONStorage(() => storage),
            // Persist auth state and responded alerts
            partialize: (state) => ({
                user: state.user,
                deviceId: state.deviceId,
                isAuthenticated: state.isAuthenticated,
                respondedAlertIds: state.respondedAlertIds
            }),
        }
    )
);

export default useStore;
