import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { colors } from './src/theme/colors';
import { theme } from './src/theme/paperTheme';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, playHighPriorityAlert } from './src/services/notifications';
import { registerBackgroundAlertCheck, createPersistentNotification } from './src/services/backgroundTask';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import AlertDetailScreen from './src/screens/AlertDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AlertHistoryScreen from './src/screens/AlertHistoryScreen';
import useStore from './src/store/useStore';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Initialize notifications and background services
    registerForPushNotificationsAsync().then(token => console.log('Push token:', token));

    // Register background task for alert checking
    registerBackgroundAlertCheck();

    // Create persistent notification to keep app alive
    createPersistentNotification();

    // Listen for incoming notifications while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Trigger intense vibration for critical alerts
      const data = notification.request.content.data;
      if (data?.severity === 'CRITICAL' || data?.severity === 'HIGH') {
        playHighPriorityAlert();
      }
    });

    // Listen for user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response:', response);
      // Can navigate to detail screen here if needed
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={colors.background} />
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "Home" : "Login"}
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerShadowVisible: false, // Clean look
              animation: 'slide_from_right', // Smooth transitions
            }}
          >
            {/* 
               Ideally we would use conditional rendering for auth flow:
               isValid ? (HomeStack) : (AuthStack)
               But for simplicity and "replace" logic in Login, we keep all in one stack
            */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false, // Using custom header
              }}
            />
            <Stack.Screen
              name="AlertDetail"
              component={AlertDetailScreen}
              options={{ title: 'Alert Details', headerTransparent: true, headerTitle: '' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AlertHistory"
              component={AlertHistoryScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
