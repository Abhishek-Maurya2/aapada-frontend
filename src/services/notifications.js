import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

// Configure how notifications should be handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Registers for push notifications and sets up channels for alerts.
 */
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        try {
            // High priority channel for emergency alerts
            await Notifications.setNotificationChannelAsync('emergency', {
                name: 'Emergency Alerts',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 500, 200, 500, 200, 500],
                lightColor: '#FF0000',
                sound: 'default',
                enableVibrate: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                bypassDnd: true, // Bypass Do Not Disturb
            });

            // Default channel
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        } catch (e) {
            console.log('Notification channel setup failed:', e.message);
        }
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push notification permission');
            return;
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (e) {
            console.log('Failed to get push token:', e.message);
        }
    } else {
        console.log('Push notifications require a physical device');
    }

    return token;
}

/**
 * Play an intense emergency vibration pattern
 */
export function playEmergencyVibration() {
    // Intense pattern: 500ms on, 200ms off, repeated
    const pattern = [0, 500, 200, 500, 200, 500, 200, 500, 200, 500];
    Vibration.vibrate(pattern, false);
}

/**
 * Triggers a high priority alert with intense vibration
 */
export async function playHighPriorityAlert() {
    try {
        // Intense vibration
        playEmergencyVibration();

        // Loop vibration every 2 seconds for 10 seconds total
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (count >= 5) {
                clearInterval(interval);
                return;
            }
            Vibration.vibrate([0, 500, 200, 500], false);
        }, 2000);

    } catch (error) {
        console.log("Error playing alert:", error);
    }
}

/**
 * Cancel all vibrations
 */
export function stopVibration() {
    Vibration.cancel();
}

