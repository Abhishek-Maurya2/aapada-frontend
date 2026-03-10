import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, Avatar } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
    const { t } = useTranslation();
    const { user, logout } = useStore();

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon source="arrow-left" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        {user?.profilePhoto ? (
                            <Image source={{ uri: user.profilePhoto }} style={styles.profileImage} />
                        ) : (
                            <Avatar.Text
                                size={96}
                                label={getInitials(user?.name)}
                                style={{ backgroundColor: colors.accent }}
                                labelStyle={{ color: colors.primary, fontWeight: '800' }}
                            />
                        )}
                        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
                        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
                            <Icon source="pencil" size={16} color={colors.primaryForeground} />
                            <Text style={styles.editBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('profile.accountInfo')}</Text>
                        <View style={styles.infoCard}>
                            {[
                                { icon: 'account', label: t('common.name'), value: user?.name || '—' },
                                { icon: 'email', label: t('common.email'), value: user?.email || '—' },
                                { icon: 'phone', label: t('common.phone', 'Phone'), value: user?.phone || '—' },
                                { icon: 'identifier', label: t('profile.userId'), value: user?.id?.slice(0, 16) || '—' },
                            ].map((item, i) => (
                                <View key={item.label}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoIcon}>
                                            <Icon source={item.icon} size={18} color={colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.infoLabel}>{item.label}</Text>
                                            <Text style={styles.infoValue}>{item.value}</Text>
                                        </View>
                                    </View>
                                    {i < 3 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Quick Links */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('profile.quickLinks')}</Text>
                        <View style={styles.linksCard}>
                            {[
                                { icon: 'history', label: t('profile.alertHistory'), onPress: () => navigation.navigate('AlertHistory') },
                                { icon: 'cog', label: t('profile.settings'), onPress: () => navigation.navigate('Settings') },
                                { icon: 'help-circle', label: t('profile.helpSupport'), onPress: () => { } },
                            ].map((item, i) => (
                                <View key={item.label}>
                                    <TouchableOpacity style={styles.linkRow} onPress={item.onPress}>
                                        <View style={styles.linkIcon}>
                                            <Icon source={item.icon} size={18} color={colors.primary} />
                                        </View>
                                        <Text style={styles.linkLabel}>{item.label}</Text>
                                        <Icon source="chevron-right" size={18} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                    {i < 2 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                        <Icon source="logout" size={18} color={colors.destructive} />
                        <Text style={styles.logoutText}>{t('common.logout')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground, flex: 1 },
    profileCard: { marginTop: spacing.l, alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 32, gap: 8 },
    profileImage: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accent },
    profileName: { fontSize: 22, fontWeight: '800', color: colors.foreground, marginTop: 8 },
    profileEmail: { fontSize: 14, color: colors.mutedForeground },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: 20, paddingVertical: 10 },
    editBtnText: { fontSize: 14, fontWeight: '700', color: colors.primaryForeground },
    section: { marginTop: 28 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 12 },
    infoCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    infoIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
    infoLabel: { fontSize: 12, color: colors.mutedForeground },
    infoValue: { fontSize: 14, fontWeight: '600', color: colors.foreground },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 4 },
    linksCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16 },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    linkIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    linkLabel: { fontSize: 15, fontWeight: '500', color: colors.foreground, flex: 1 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, borderWidth: 2, borderColor: colors.destructive, borderRadius: borderRadius.full, paddingVertical: 14, marginBottom: 32 },
    logoutText: { fontSize: 16, fontWeight: '700', color: colors.destructive },
});
