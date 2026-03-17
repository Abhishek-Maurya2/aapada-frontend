import React, { useState } from 'react';
import {
    View, StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, TextInput as RNTextInput, TouchableOpacity,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import useStore from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function SignupScreen({ navigation }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const signup = useStore((state) => state.signup);
    const loading = useStore((state) => state.loading);
    const error = useStore((state) => state.error);

    const handleSignup = async () => {
        if (!name || !email || !password) return;
        const success = await signup(name, email, password);
        if (success) {
            navigation.replace('Home');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        {/* Header with avatar */}
                        <View style={styles.headerArea}>
                            <View style={styles.avatarCircle}>
                                <Icon source="account" size={40} color={colors.primary} />
                            </View>
                            <Text style={styles.title}>{t('signup.title')}</Text>
                            <Text style={styles.subtitle}>{t('signup.subtitle')}</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formSection}>
                            {/* Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('common.name')}</Text>
                                <View style={styles.inputRow}>
                                    <Icon source="account-outline" size={18} color={colors.primary} />
                                    <RNTextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder={t('signup.namePlaceholder')}
                                        placeholderTextColor={colors.mutedForeground}
                                        style={styles.inputText}
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('common.email')}</Text>
                                <View style={styles.inputRow}>
                                    <Icon source="email-outline" size={18} color={colors.primary} />
                                    <RNTextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={t('signup.emailPlaceholder')}
                                        placeholderTextColor={colors.mutedForeground}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={styles.inputText}
                                    />
                                </View>
                            </View>

                            {/* Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('common.password')}</Text>
                                <View style={styles.inputRow}>
                                    <Icon source="lock-outline" size={18} color={colors.primary} />
                                    <RNTextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder={t('signup.passwordPlaceholder')}
                                        placeholderTextColor={colors.mutedForeground}
                                        secureTextEntry={!showPassword}
                                        style={styles.inputText}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Icon
                                            source={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={18}
                                            color={colors.mutedForeground}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {error && (
                                <View style={styles.errorBanner}>
                                    <Icon source="alert-circle" size={16} color={colors.destructive} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                                onPress={handleSignup}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.primaryBtnText}>
                                    {loading ? t('signup.creating') : t('signup.signupBtn')}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>{t('signup.hasAccount')}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.footerLink}>{t('common.login')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.xl,
    },
    headerArea: {
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.foreground,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
    formSection: {
        marginVertical: 24,
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.foreground,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: colors.foreground,
        marginLeft: 12,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.errorContainer,
        padding: 12,
        borderRadius: 12,
    },
    errorText: {
        color: colors.onErrorContainer,
        fontSize: 13,
        flex: 1,
    },
    actions: {
        gap: 16,
        paddingBottom: 16,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primaryForeground,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
});
