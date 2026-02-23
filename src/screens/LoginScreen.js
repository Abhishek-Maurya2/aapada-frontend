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

export default function LoginScreen({ navigation }) {
    const { t } = useTranslation();
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

    const featurePills = [
        t('login.pills.liveAlerts'),
        t('login.pills.safetyMaps'),
        t('login.pills.sos'),
        t('login.pills.weather'),
    ];

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
                        {/* Hero Section */}
                        <View style={styles.heroSection}>
                            {/* Decorative blobs */}
                            <View style={styles.blobContainer}>
                                <View style={[styles.blob, styles.blob1]} />
                                <View style={[styles.blob, styles.blob2]} />
                                <View style={[styles.blob, styles.blob3]} />
                                <View style={styles.iconSquare}>
                                    <Icon source="shield" size={48} color="#fff" />
                                </View>
                            </View>

                            {/* Title */}
                            <Text style={styles.heroTitle}>{t('login.title')}</Text>
                            <Text style={styles.heroSub}>{t('login.subtitle')}</Text>

                            {/* Feature pills */}
                            <View style={styles.pillsRow}>
                                {featurePills.map((tag) => (
                                    <View key={tag} style={styles.pill}>
                                        <Text style={styles.pillText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('common.email')}</Text>
                                <View style={styles.inputRow}>
                                    <Icon source="email-outline" size={18} color={colors.primary} />
                                    <RNTextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={t('login.emailPlaceholder')}
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
                                        placeholder={t('login.passwordPlaceholder')}
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
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.primaryBtnText}>
                                    {loading ? t('login.loggingIn') : t('login.loginBtn')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.outlineBtn}
                                onPress={() => navigation.navigate('Signup')}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.outlineBtnText}>{t('login.createAccount')}</Text>
                            </TouchableOpacity>
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
    // Hero
    heroSection: {
        alignItems: 'flex-start',
        gap: 16,
    },
    blobContainer: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 8,
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
    },
    blob1: {
        width: 80,
        height: 80,
        backgroundColor: colors.primary + '30',
        top: 0,
        left: 0,
    },
    blob2: {
        width: 60,
        height: 60,
        backgroundColor: colors.accent + '50',
        top: 10,
        right: 0,
    },
    blob3: {
        width: 50,
        height: 50,
        backgroundColor: colors.secondary + '40',
        bottom: 0,
        left: 20,
    },
    iconSquare: {
        position: 'absolute',
        width: 72,
        height: 72,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        top: 24,
        left: 24,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.foreground,
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    heroSub: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
    },
    pillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.full,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.secondaryForeground,
    },
    // Form
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
    // Actions
    actions: {
        gap: 12,
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
    outlineBtn: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: borderRadius.full,
        paddingVertical: 14,
        alignItems: 'center',
    },
    outlineBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
});
