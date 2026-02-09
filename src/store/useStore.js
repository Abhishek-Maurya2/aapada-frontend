import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import storage from '../services/storage';
import api from '../services/api';
import { playAlarm, stopAlarm } from '../services/alarm';

const generateDeviceId = () => {
    return 'device-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            alerts: [],
            respondedAlertIds: [], // Track alerts user has responded to
            lastSeenAlertId: null, // Track the last seen alert to detect new ones
            loading: false,
            error: null,

            // Actions
            login: async (email, password, name) => {
                set({ loading: true, error: null });
                try {
                    const deviceId = generateDeviceId();
                    const fcmToken = 'dummy-fcm-token-' + Date.now();

                    const response = await api.post('/devices/register', {
                        deviceId,
                        fcmToken,
                        platform: 'android',
                        location: { type: 'Point', coordinates: [0, 0] }
                    });

                    if (response.data.success) {
                        const user = {
                            id: response.data.data.deviceId,
                            name: name || email.split('@')[0],
                            email: email
                        };
                        set({ user, isAuthenticated: true, loading: false, respondedAlertIds: [] });
                        return true;
                    } else {
                        throw new Error(response.data.message || 'Registration failed');
                    }
                } catch (err) {
                    console.error(err);
                    set({ error: err.response?.data?.message || err.message || 'Login failed', loading: false });
                    return false;
                }
            },

            logout: () => set({ user: null, isAuthenticated: false, alerts: [], respondedAlertIds: [] }),

            fetchAlerts: async (silent = false) => {
                if (!silent) {
                    set({ loading: true, error: null });
                }
                try {
                    const response = await api.get('/alerts');
                    const { respondedAlertIds, lastSeenAlertId } = get();

                    if (response.data.success) {
                        // Filter out alerts user has already responded to
                        const allAlerts = response.data.data.map(alert => ({
                            id: alert._id,
                            title: alert.title,
                            severity: alert.severity,
                            location: alert.targetRegion,
                            time: new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            description: alert.message
                        }));

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
                    const { user } = get();
                    if (!user?.id) return;

                    await api.post('/alerts/feedback', {
                        alertId,
                        deviceId: user.id,
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
                    const { user } = get();
                    if (!user?.id) return false;

                    await api.post('/alerts/feedback', {
                        alertId,
                        deviceId: user.id,
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
                isAuthenticated: state.isAuthenticated,
                respondedAlertIds: state.respondedAlertIds
            }),
        }
    )
);

export default useStore;
