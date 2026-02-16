import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, Icon } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Branding */}
                <View style={styles.brandArea}>
                    <Surface style={styles.iconCircle} elevation={2}>
                        <Icon source="shield-alert" size={48} color={colors.primary} />
                    </Surface>
                    <Text variant="displaySmall" style={styles.appName}>Aapada</Text>
                    <Text variant="titleMedium" style={styles.tagline}>
                        Disaster Alert System
                    </Text>
                </View>

                {/* Form Card */}
                <Surface style={styles.formCard} elevation={1}>
                    <Text variant="headlineSmall" style={styles.formTitle}>Welcome Back</Text>

                    <TextInput
                        mode="outlined"
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        left={<TextInput.Icon icon="email-outline" />}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                    />

                    <TextInput
                        mode="outlined"
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        left={<TextInput.Icon icon="lock-outline" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                    />

                    {error && (
                        <Surface style={styles.errorBanner} elevation={0}>
                            <Icon source="alert-circle" size={18} color={colors.error} />
                            <Text variant="bodySmall" style={styles.errorText}>{error}</Text>
                        </Surface>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.loginButton}
                        contentStyle={styles.loginButtonContent}
                        labelStyle={styles.loginButtonLabel}
                    >
                        Login
                    </Button>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                            Don't have an account?
                        </Text>
                        <Button
                            mode="text"
                            onPress={() => navigation.navigate('Signup')}
                            compact
                            labelStyle={{ fontWeight: '600' }}
                        >
                            Sign Up
                        </Button>
                    </View>
                </Surface>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.l,
        justifyContent: 'center',
    },
    brandArea: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.primaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    appName: {
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: 1,
    },
    tagline: {
        color: colors.onSurfaceVariant,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 28,
        padding: spacing.l,
    },
    formTitle: {
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    input: {
        marginBottom: spacing.m,
        backgroundColor: colors.surface,
    },
    inputOutline: {
        borderRadius: 16,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.errorContainer,
        padding: 12,
        borderRadius: 12,
        marginBottom: spacing.m,
    },
    errorText: {
        color: colors.onErrorContainer,
        flex: 1,
    },
    loginButton: {
        borderRadius: 20,
        marginTop: spacing.s,
    },
    loginButtonContent: {
        paddingVertical: 6,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.l,
    },
});
