import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { Vibration, Platform } from 'react-native';
import api from './api';
import storage from './storage';

const BACKGROUND_FETCH_TASK = 'BACKGROUND_ALERT_CHECK';

// Store last seen alert ID to detect new ones
let lastSeenAlertId = null;

/**
 * Plays an intense vibration pattern for emergency alerts
 */
export function playEmergencyVibration() {
  // Pattern: vibrate 500ms, pause 200ms, repeat 5 times
  const pattern = [0, 500, 200, 500, 200, 500, 200, 500, 200, 500];

  if (Platform.OS === 'android') {
    Vibration.vibrate(pattern, false); // false = don't repeat
  } else {
    Vibration.vibrate(pattern);
  }
}

/**
 * Check for new alerts and notify the user
 * Uses device-aware endpoint with location update
 */
async function checkForNewAlerts() {
  try {
    // Try to get stored user info for device-aware filtering
    let deviceId = null;
    try {
      const stored = await storage.getItem('aapada-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        deviceId = parsed?.state?.user?.id;
      }
    } catch (e) {
      console.log('Could not read stored user:', e.message);
    }

    // Update location on server if we have a device ID
    if (deviceId) {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          await api.put(`/devices/${deviceId}/location`, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (locErr) {
        console.log('Background location update failed:', locErr.message);
      }
    }

    // Use device-aware endpoint if available, fallback to global
    const endpoint = deviceId ? `/alerts/device/${deviceId}` : '/alerts';
    const response = await api.get(endpoint);

    if (response.data.success && response.data.data.length > 0) {
      const latestAlert = response.data.data[0];

      // Check if this is a new alert we haven't seen
      if (latestAlert._id !== lastSeenAlertId) {
        lastSeenAlertId = latestAlert._id;

        // Schedule a local notification with high priority
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🚨 ${latestAlert.severity}: ${latestAlert.title}`,
            body: latestAlert.message,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: [0, 500, 200, 500],
            data: { alertId: latestAlert._id, severity: latestAlert.severity },
          },
          trigger: null, // Immediate
        });

        // Also vibrate intensely
        playEmergencyVibration();

        return BackgroundFetch.BackgroundFetchResult.NewData;
      }
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background alert check failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
}

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  return await checkForNewAlerts();
});

/**
 * Register the background fetch task
 */
export async function registerBackgroundAlertCheck() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // Check every 60 seconds minimum
      stopOnTerminate: false, // Keep running after app is closed
      startOnBoot: true, // Start on device boot
    });
    console.log('Background alert check registered');
  } catch (error) {
    console.error('Failed to register background task:', error);
  }
}

/**
 * Create a persistent foreground notification
 */
export async function createPersistentNotification() {
  if (Platform.OS !== 'android') return;

  try {
    // Create a dedicated channel for the persistent notification
    await Notifications.setNotificationChannelAsync('persistent', {
      name: 'Background Service',
      importance: Notifications.AndroidImportance.LOW,
      sound: null,
      vibrationPattern: null,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // Schedule the persistent notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🛡️ Aapada Active',
        body: 'Monitoring for disaster alerts...',
        sticky: true, // Makes it persistent
        autoDismiss: false,
      },
      trigger: null,
      identifier: 'persistent-notification',
    });
  } catch (error) {
    console.error('Failed to create persistent notification:', error);
  }
}
