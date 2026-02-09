import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { colors, spacing, typography } from '../theme/colors';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const login = useStore((state) => state.login);
    const loading = useStore((state) => state.loading);
    const error = useStore((state) => state.error);

    const handleLogin = async () => {
        if (!email || !password) return;

        const success = await login(email, password);
        if (success) {
            navigation.replace('Home');
        }
    };

    return (
        <LinearGradient
            colors={[colors.background, '#1E293B']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.header}>
                        <Text variant="displayMedium" style={styles.title}>Aapada</Text>
                        <Text variant="headlineSmall" style={styles.subtitle}>Disaster Alert System</Text>
                    </View>

                    <Surface style={styles.form} elevation={4}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                left={<TextInput.Icon icon="email" />}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                left={<TextInput.Icon icon="lock" />}
                                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                            />
                        </View>

                        {error && (
                            <Text style={{ color: colors.error, marginBottom: spacing.m, textAlign: 'center' }}>
                                {error}
                            </Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            Login
                        </Button>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('Signup')}
                                compact
                            >
                                Sign Up
                            </Button>
                        </View>
                    </Surface>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: spacing.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl * 2,
    },
    title: {
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: spacing.s,
        letterSpacing: 1,
    },
    subtitle: {
        color: colors.textSecondary,
    },
    form: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.l,
    },
    inputContainer: {
        marginBottom: spacing.m,
    },
    button: {
        marginTop: spacing.s,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.l,
    },
    footerText: {
        color: colors.textSecondary,
    },
});


