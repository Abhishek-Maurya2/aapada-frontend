import React, { useState } from 'react';
import Constants from 'expo-constants';
import {
    View, ScrollView, StyleSheet, TouchableOpacity, Switch, Linking,
    Modal, Pressable, Image, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/i18n';
import { checkGithubApkUpdate } from '../services/appUpdate';

export default function SettingsScreen({ navigation }) {
    const { t, i18n } = useTranslation();
    const { user, logout } = useStore();
    const [notifications, setNotifications] = useState(true);
    const [soundAlerts, setSoundAlerts] = useState(true);
    const [vibration, setVibration] = useState(true);
    const [autoLocate, setAutoLocate] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [langModalVisible, setLangModalVisible] = useState(false);
    const [checkingUpdate, setCheckingUpdate] = useState(false);

    const handleLogout = () => {
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setLangModalVisible(false);
    };

    const handleCheckForUpdates = async () => {
        if (Platform.OS !== 'android') {
            Alert.alert('Updates', 'APK updates are available on Android only.');
            return;
        }

        try {
            setCheckingUpdate(true);
            const result = await checkGithubApkUpdate();

            if (!result.ok) {
                Alert.alert('Update check failed', result.message);
                return;
            }

            if (!result.updateAvailable) {
                Alert.alert('No update available', `You are on the latest version (${result.currentVersion}).`);
                return;
            }

            const notes = result.releaseName ? `\n\nRelease: ${result.releaseName}` : '';
            Alert.alert(
                'Update available',
                `Current version: ${result.currentVersion}\nLatest version: ${result.latestVersion}${notes}`,
                [
                    { text: 'Later', style: 'cancel' },
                    {
                        text: 'Download APK',
                        onPress: () => Linking.openURL(result.apkUrl || result.releaseUrl),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Update check failed', 'Unable to contact GitHub Releases right now.');
        } finally {
            setCheckingUpdate(false);
        }
    };

    const SettingToggle = ({ icon, label, description, value, onValueChange }) => (
        <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
                <Icon source={icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>{label}</Text>
                {description && <Text style={styles.settingDesc}>{description}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={value ? colors.primary : colors.mutedForeground}
            />
        </View>
    );

    const SettingLink = ({ icon, label, description, onPress, rightText, loading }) => (
        <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.settingIcon}>
                <Icon source={icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>{label}</Text>
                {description && <Text style={styles.settingDesc}>{description}</Text>}
            </View>
            {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
            ) : rightText ? (
                <Text style={styles.rightText}>{rightText}</Text>
            ) : (
                <Icon source="chevron-right" size={18} color={colors.mutedForeground} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon source="arrow-left" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Profile Quick Card */}
                    <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')} activeOpacity={0.75}>
                        <View style={styles.profileAvatar}>
                            {user?.profilePhoto ? (
                                <Image source={{ uri: user.profilePhoto }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                            <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
                        </View>
                        <Icon source="chevron-right" size={20} color={colors.mutedForeground} />
                    </TouchableOpacity>

                    {/* Notifications */}
                    <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
                    <View style={styles.settingsCard}>
                        <SettingToggle icon="bell" label={t('settings.pushNotifications')} description={t('settings.pushDesc')} value={notifications} onValueChange={setNotifications} />
                        <View style={styles.divider} />
                        <SettingToggle icon="volume-high" label={t('settings.soundAlerts')} description={t('settings.soundDesc')} value={soundAlerts} onValueChange={setSoundAlerts} />
                        <View style={styles.divider} />
                        <SettingToggle icon="vibrate" label={t('settings.vibration')} description={t('settings.vibrationDesc')} value={vibration} onValueChange={setVibration} />
                    </View>

                    {/* Privacy & Location */}
                    <Text style={styles.sectionTitle}>{t('settings.privacyLocation')}</Text>
                    <View style={styles.settingsCard}>
                        <SettingToggle icon="crosshairs-gps" label={t('settings.autoLocation')} description={t('settings.autoLocationDesc')} value={autoLocate} onValueChange={setAutoLocate} />
                        <View style={styles.divider} />
                        <SettingLink icon="shield-lock" label={t('settings.privacyPolicy')} onPress={() => { }} />
                    </View>

                    {/* Appearance */}
                    <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
                    <View style={styles.settingsCard}>
                        <SettingToggle icon="theme-light-dark" label={t('settings.darkMode')} description={t('settings.darkModeDesc')} value={darkMode} onValueChange={setDarkMode} />
                        <View style={styles.divider} />
                        <SettingLink
                            icon="translate"
                            label={t('settings.language')}
                            rightText={currentLang.nativeLabel}
                            onPress={() => setLangModalVisible(true)}
                        />
                    </View>

                    {/* Support */}
                    <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
                    <View style={styles.settingsCard}>
                        <SettingLink icon="help-circle" label={t('settings.helpFaq')} onPress={() => { }} />
                        <View style={styles.divider} />
                        <SettingLink icon="message-text" label={t('settings.contactSupport')} onPress={() => Linking.openURL('mailto:support@aapada.app')} />
                        <View style={styles.divider} />
                        <SettingLink
                            icon="download"
                            label="Check for updates"
                            description="Download the latest APK from GitHub"
                            onPress={handleCheckForUpdates}
                            loading={checkingUpdate}
                        />
                        <View style={styles.divider} />
                        <SettingLink icon="star" label={t('settings.rateApp')} onPress={() => { }} />
                        <View style={styles.divider} />
                        <SettingLink icon="information" label={t('settings.aboutAapada')} rightText={`v${Constants.expoConfig?.version || '1.0.0'}`} onPress={() => { }} />
                    </View>

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                        <Icon source="logout" size={18} color={colors.destructive} />
                        <Text style={styles.logoutText}>{t('common.logout')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Language Picker Modal */}
            <Modal
                visible={langModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setLangModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
                        {LANGUAGES.map((lang) => {
                            const isActive = i18n.language === lang.code;
                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langRow, isActive && styles.langRowActive]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.langLabel, isActive && { color: colors.primary, fontWeight: '700' }]}>
                                            {lang.nativeLabel}
                                        </Text>
                                        <Text style={styles.langSub}>{lang.label}</Text>
                                    </View>
                                    {isActive && (
                                        <View style={styles.langCheck}>
                                            <Icon source="check" size={16} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground, flex: 1 },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: spacing.l, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16 },
    profileAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { fontSize: 18, fontWeight: '800', color: colors.primary },
    profileName: { fontSize: 16, fontWeight: '700', color: colors.foreground },
    profileEmail: { fontSize: 13, color: colors.mutedForeground },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginTop: 28, marginBottom: 12 },
    settingsCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 4 },
    settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
    settingIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
    settingLabel: { fontSize: 15, fontWeight: '500', color: colors.foreground },
    settingDesc: { fontSize: 12, color: colors.mutedForeground, marginTop: 1 },
    rightText: { fontSize: 13, color: colors.mutedForeground, fontWeight: '500' },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, borderWidth: 2, borderColor: colors.destructive, borderRadius: borderRadius.full, paddingVertical: 14, marginBottom: 32 },
    logoutText: { fontSize: 16, fontWeight: '700', color: colors.destructive },
    // Lang Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: colors.background, borderRadius: borderRadius.lg, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground, marginBottom: 20 },
    langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: borderRadius.md },
    langRowActive: { backgroundColor: colors.primaryContainer },
    langLabel: { fontSize: 16, fontWeight: '500', color: colors.foreground },
    langSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
    langCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
