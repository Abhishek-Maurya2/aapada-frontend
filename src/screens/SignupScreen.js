import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { colors, spacing, typography } from '../theme/colors';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const login = useStore((state) => state.login);
    const loading = useStore((state) => state.loading);
    const error = useStore((state) => state.error);

    const handleSignup = async () => {
        if (!name || !email || !password) return;

        // Reusing login action as it performs registration
        const success = await login(email, password, name);
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
                        <Text variant="displaySmall" style={styles.title}>Create Account</Text>
                        <Text variant="headlineSmall" style={styles.subtitle}>Join Aapada Network</Text>
                    </View>

                    <Surface style={styles.form} elevation={4}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Full Name"
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={setName}
                                left={<TextInput.Icon icon="account" />}
                            />
                        </View>

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
                                placeholder="Create a password"
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
                            onPress={handleSignup}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            Sign Up
                        </Button>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('Login')}
                                compact
                            >
                                Login
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
        marginBottom: spacing.xl,
    },
    title: {
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: spacing.s,
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

