import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, Icon } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        const success = await login(email, password, name);
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
                {/* Header */}
                <View style={styles.headerArea}>
                    <Surface style={styles.iconCircle} elevation={2}>
                        <Icon source="account-plus" size={44} color={colors.primary} />
                    </Surface>
                    <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
                    <Text variant="titleMedium" style={styles.subtitle}>
                        Join the Aapada Network
                    </Text>
                </View>

                {/* Form Card */}
                <Surface style={styles.formCard} elevation={1}>
                    <TextInput
                        mode="outlined"
                        label="Full Name"
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon="account-outline" />}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                    />

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
                        placeholder="Create a password"
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
                        onPress={handleSignup}
                        loading={loading}
                        disabled={loading}
                        style={styles.signupButton}
                        contentStyle={styles.signupButtonContent}
                        labelStyle={styles.signupButtonLabel}
                    >
                        Sign Up
                    </Button>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                            Already have an account?
                        </Text>
                        <Button
                            mode="text"
                            onPress={() => navigation.navigate('Login')}
                            compact
                            labelStyle={{ fontWeight: '600' }}
                        >
                            Login
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
    headerArea: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    title: {
        fontWeight: '800',
        color: colors.onSurface,
    },
    subtitle: {
        color: colors.onSurfaceVariant,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 28,
        padding: spacing.l,
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
    signupButton: {
        borderRadius: 20,
        marginTop: spacing.s,
    },
    signupButtonContent: {
        paddingVertical: 6,
    },
    signupButtonLabel: {
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
