import { Vibration, Platform } from 'react-native';
import { Audio } from 'expo-av';

let alarmSound = null;
let isAlarmPlaying = false;

// Local alert sound from assets
const ALARM_SOUND = require('../../assets/alert.wav');

/**
 * Initialize audio settings for loud alarm playback
 */
async function initializeAudio() {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
        });
    } catch (error) {
        console.log('Error initializing audio:', error);
    }
}

/**
 * Play intense alarm with vibration AND sound
 */
export async function playAlarm() {
    if (isAlarmPlaying) return;
    isAlarmPlaying = true;

    try {
        // Initialize audio mode for loud playback
        await initializeAudio();

        // Start intense vibration pattern - REPEATING
        const pattern = [0, 1000, 500, 1000, 500, 1000, 500, 1000];
        if (Platform.OS === 'android') {
            Vibration.vibrate(pattern, true); // true = repeat
        } else {
            Vibration.vibrate(pattern);
        }

        // Load and play local alarm sound
        const { sound } = await Audio.Sound.createAsync(
            ALARM_SOUND,
            {
                shouldPlay: true,
                isLooping: true,
                volume: 1.0,
            }
        );
        alarmSound = sound;

        console.log('🚨 ALARM PLAYING - Sound + Vibration!');

    } catch (error) {
        console.log('Error playing alarm sound:', error);
        // Keep vibrating even if sound fails
    }
}

/**
 * Stop the alarm (vibration and sound)
 */
export async function stopAlarm() {
    isAlarmPlaying = false;

    // Stop vibration
    Vibration.cancel();

    // Stop sound if playing
    if (alarmSound) {
        try {
            await alarmSound.stopAsync();
            await alarmSound.unloadAsync();
            alarmSound = null;
        } catch (error) {
            console.log('Error stopping alarm sound:', error);
        }
    }

    console.log('🔕 Alarm stopped');
}

/**
 * Check if alarm is currently playing
 */
export function isPlaying() {
    return isAlarmPlaying;
}
