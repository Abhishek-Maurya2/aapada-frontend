import React, { useState } from 'react';
import {
    View, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const SEVERITY_CONFIG = {
    CRITICAL: { bg: '#FEE2E2', text: '#B91C1C', label: 'CRITICAL' },
    HIGH: { bg: '#FFEDD5', text: '#C2410C', label: 'HIGH' },
    MEDIUM: { bg: '#FEF3C7', text: '#A16207', label: 'MEDIUM' },
    LOW: { bg: '#DCFCE7', text: '#15803D', label: 'LOW' },
};

const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return '#dc2626';
        case 'HIGH': return '#3b82f6';
        case 'MEDIUM': return '#f59e0b';
        default: return '#22c55e';
    }
};

const getSeverityIcon = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return 'flash-alert';
        case 'HIGH': return 'waves';
        case 'MEDIUM': return 'weather-windy';
        default: return 'fire';
    }
};

export default function AlertDetailScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { alert } = route.params;
    const sevConfig = SEVERITY_CONFIG[alert.severity?.toUpperCase()] || SEVERITY_CONFIG.LOW;
    const alertColor = getSeverityColor(alert.severity);
    const [expanded, setExpanded] = useState(true);

    const EMERGENCY_CONTACTS = [
        { label: t('alertDetail.emergency'), number: '112', icon: 'phone', bg: '#EF4444' },
        { label: t('alertDetail.ndrf'), number: '011-24363260', icon: 'shield', bg: colors.primary },
        { label: t('alertDetail.ambulance'), number: '108', icon: 'ambulance', bg: '#3B82F6' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon source="arrow-left" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{t('alertDetail.title')}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: sevConfig.bg }]}>
                            <Text style={[styles.badgeText, { color: sevConfig.text }]}>{sevConfig.label}</Text>
                        </View>
                    </View>

                    {/* Active Warning Banner */}
                    <View style={styles.warningBanner}>
                        <View style={styles.warningIcon}>
                            <Icon source="shield-alert" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.warningTitle}>{t('alertDetail.activeWarning')}</Text>
                            <Text style={styles.warningSub}>{alert.title}</Text>
                        </View>
                    </View>

                    {/* Alert Card */}
                    <TouchableOpacity style={styles.alertCard} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
                        <View style={styles.alertCardRow}>
                            <View style={[styles.alertIconBox, { backgroundColor: alertColor + '20' }]}>
                                <Icon source={getSeverityIcon(alert.severity)} size={22} color={alertColor} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={styles.alertTitleRow}>
                                    <Text style={styles.alertType}>{alert.title}</Text>
                                    <View style={[styles.sevPill, { backgroundColor: sevConfig.bg }]}>
                                        <Text style={[styles.sevPillText, { color: sevConfig.text }]}>{sevConfig.label}</Text>
                                    </View>
                                </View>
                                <View style={styles.alertMeta}>
                                    <Icon source="map-marker" size={12} color={colors.mutedForeground} />
                                    <Text style={styles.alertMetaText}>
                                        {alert.location || t('home.allAreas')} · {alert.time}
                                    </Text>
                                </View>
                            </View>
                            <Icon source="chevron-right" size={16} color={colors.mutedForeground} />
                        </View>
                        {expanded && (
                            <View style={styles.expandedSection}>
                                <Text style={styles.descriptionText}>{alert.description}</Text>
                                <View style={styles.expandedBtns}>
                                    <TouchableOpacity style={styles.getAfeBtn} onPress={() => navigation.navigate('EmergencyAlert', { alert })}>
                                        <Icon source="shield" size={14} color="#fff" />
                                        <Text style={styles.getSafeText}>{t('alertDetail.getSafe')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.detailsBtn}>
                                        <Icon source="information" size={14} color={colors.secondaryForeground} />
                                        <Text style={styles.detailsBtnText}>{t('alertDetail.details')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Immediate Actions */}
                    <View style={styles.actionsCard}>
                        <Text style={styles.actionsTitle}>{t('alertDetail.immediateActions')}</Text>
                        <View style={{ gap: 10 }}>
                            {[
                                { icon: 'shield-check', text: t('alertDetail.action1') },
                                { icon: 'exit-run', text: t('alertDetail.action2') },
                                { icon: 'phone-in-talk', text: t('alertDetail.action3') },
                            ].map((item) => (
                                <View key={item.text} style={styles.actionRow}>
                                    <Icon source={item.icon} size={20} color={colors.primary} />
                                    <Text style={styles.actionText}>{item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* I'm Safe Button */}
                    <TouchableOpacity style={styles.safeBtn} onPress={() => navigation.navigate('EmergencyAlert', { alert })} activeOpacity={0.8}>
                        <View style={styles.safeCheckmark}>
                            <Text style={styles.safeCheckText}>✓</Text>
                        </View>
                        <Text style={styles.safeBtnText}>{t('alertDetail.imSafe')}</Text>
                    </TouchableOpacity>

                    {/* Emergency Contacts */}
                    <Text style={styles.sectionTitle}>{t('alertDetail.emergencyContacts')}</Text>
                    <View style={styles.contactsRow}>
                        {EMERGENCY_CONTACTS.map((contact) => (
                            <TouchableOpacity key={contact.label} style={styles.contactCard} activeOpacity={0.75} onPress={() => Linking.openURL(`tel:${contact.number}`)}>
                                <View style={[styles.contactIcon, { backgroundColor: contact.bg }]}>
                                    <Icon source={contact.icon} size={20} color="#fff" />
                                </View>
                                <Text style={styles.contactLabel}>{contact.label}</Text>
                                <Text style={styles.contactNumber}>{contact.number}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground },
    badge: { borderRadius: borderRadius.full, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 10, fontWeight: '700' },
    warningBanner: { marginTop: spacing.l, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: borderRadius.lg, padding: 16 },
    warningIcon: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
    warningTitle: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
    warningSub: { fontSize: 12, color: '#DC2626' },
    alertCard: { marginTop: 20, backgroundColor: colors.card, borderRadius: borderRadius.lg, overflow: 'hidden' },
    alertCardRow: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
    alertIconBox: { width: 48, height: 48, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
    alertTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    alertType: { fontSize: 14, fontWeight: '700', color: colors.foreground },
    sevPill: { borderRadius: borderRadius.full, paddingHorizontal: 8, paddingVertical: 2 },
    sevPillText: { fontSize: 10, fontWeight: '700' },
    alertMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    alertMetaText: { fontSize: 12, color: colors.mutedForeground },
    expandedSection: { borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
    descriptionText: { fontSize: 14, color: colors.mutedForeground, lineHeight: 20 },
    expandedBtns: { flexDirection: 'row', gap: 8, marginTop: 12 },
    getAfeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: 10 },
    getSafeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    detailsBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.secondary, borderRadius: borderRadius.full, paddingVertical: 10 },
    detailsBtnText: { fontSize: 12, fontWeight: '700', color: colors.secondaryForeground },
    actionsCard: { marginTop: 20, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 20 },
    actionsTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    actionText: { fontSize: 14, color: colors.mutedForeground, flex: 1, lineHeight: 22 },
    safeBtn: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: 16 },
    safeCheckmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    safeCheckText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    safeBtnText: { fontSize: 16, fontWeight: '700', color: colors.primary },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginTop: 32, marginBottom: 12 },
    contactsRow: { flexDirection: 'row', gap: 12, paddingBottom: 32 },
    contactCard: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: colors.card, borderRadius: borderRadius.lg, paddingVertical: 20 },
    contactIcon: { width: 48, height: 48, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
    contactLabel: { fontSize: 12, fontWeight: '600', color: colors.foreground },
    contactNumber: { fontSize: 10, color: colors.mutedForeground },
});
