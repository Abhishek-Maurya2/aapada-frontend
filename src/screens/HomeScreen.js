import React, { useEffect, useState } from 'react';
import {
    View, ScrollView, StyleSheet, TouchableOpacity,
    RefreshControl, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, Snackbar } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { getPrecautionsForType } from '../data/alertPrecautions';

const FLAG_COLORS = {
    RED: '#EF4444',
    ORANGE: '#F97316',
    YELLOW: '#EAB308',
    GREEN: '#22C55E'
};

const getAlertColor = (alert) => {
    if (alert.flag && FLAG_COLORS[alert.flag]) return FLAG_COLORS[alert.flag];
    switch (alert.severity?.toUpperCase()) {
        case 'CRITICAL': return '#dc2626';
        case 'HIGH': return '#3b82f6';
        case 'MEDIUM': return '#f59e0b';
        default: return '#22c55e';
    }
};

const getAlertIcon = (alert) => {
    const disasterData = getPrecautionsForType(alert.alertType);
    if (disasterData && disasterData.icon) return disasterData.icon;

    switch (alert.severity?.toUpperCase()) {
        case 'CRITICAL': return 'flash-alert';
        case 'HIGH': return 'waves';
        case 'MEDIUM': return 'weather-windy';
        default: return 'fire';
    }
};

export default function HomeScreen({ navigation }) {
    const { t } = useTranslation();
    const { alerts, loading, fetchAlerts, user, sendFeedback, dismissAlarm } = useStore();
    const [feedbackSent, setFeedbackSent] = useState(null);

    const QUICK_ACTIONS = [
        { icon: 'alarm-light', label: t('home.sos'), bg: '#EF4444', iconColor: '#fff' },
        { icon: 'phone', label: t('home.call112'), bg: colors.primary, iconColor: '#fff' },
        { icon: 'map-marker-radius', label: t('home.safeZones'), bg: colors.accent, iconColor: colors.primary },
        { icon: 'weather-cloudy', label: t('home.weather'), bg: colors.secondary, iconColor: colors.secondaryForeground },
    ];

    const CHECKLIST = [
        t('home.checklist.kit'),
        t('home.checklist.contact'),
        t('home.checklist.evacuation'),
    ];

    useEffect(() => {
        fetchAlerts();
        const pollInterval = setInterval(() => {
            fetchAlerts(true);
        }, 5000);
        return () => clearInterval(pollInterval);
    }, []);

    const handleAlertPress = (alert) => {
        navigation.navigate('AlertDetail', { alert });
    };

    const handleAction = async (alertId, actionType) => {
        dismissAlarm();
        const success = await sendFeedback(alertId, actionType);
        if (success) {
            setFeedbackSent(actionType);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchAlerts}
                        colors={[colors.primary]}
                    />
                }
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>{t('home.greeting', { name: user?.name || 'User' })}</Text>
                            <Text style={styles.headerTitle}>{t('home.title')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Settings')}
                                style={styles.bellBtn}
                            >
                                <Icon source="cog" size={22} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AlertHistory')}
                                style={styles.bellBtn}
                            >
                                <Icon source="bell" size={22} color={colors.primary} />
                                {alerts.length > 0 && <View style={styles.bellDot} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Status Banner */}
                    <View style={styles.statusBanner}>
                        <View style={styles.statusIcon}>
                            <Icon source="shield" size={28} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.statusTitle}>
                                {alerts.length > 0
                                    ? t('home.activeAlerts', { count: alerts.length })
                                    : t('home.allClear')}
                            </Text>
                            <Text style={styles.statusSub}>
                                {alerts.length > 0
                                    ? t('home.tapToRespond')
                                    : t('home.noActiveDisasters')}
                            </Text>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    {/*
                    <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
                    <View style={styles.quickGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.label}
                                style={styles.quickCard}
                                activeOpacity={0.75}
                                onPress={() => {
                                    if (action.label === t('home.call112')) Linking.openURL('tel:112');
                                }}
                            >
                                <View style={[styles.quickIconBox, { backgroundColor: action.bg }]}>
                                    <Icon source={action.icon} size={22} color={action.iconColor} />
                                </View>
                                <Text style={styles.quickLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>*/}

                    {/* Emergency Checklist */}
                    <View style={styles.checklistCard}>
                        <View style={styles.checklistHeader}>
                            <Text style={styles.checklistTitle}>{t('home.emergencyChecklist')}</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ gap: 8, marginTop: 12 }}>
                            {CHECKLIST.map((item) => (
                                <View key={item} style={styles.checklistRow}>
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                    <Text style={styles.checklistItemText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Recent Alerts */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('home.recentAlerts')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AlertHistory')}>
                            <Text style={styles.viewAllText}>{t('common.seeAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ gap: 12, paddingBottom: 80 }}>
                        {alerts.length > 0 ? (
                            alerts.map((alert) => {
                                const alertColor = getAlertColor(alert);
                                return (
                                    <TouchableOpacity
                                        key={alert.id}
                                        style={styles.alertCard}
                                        onPress={() => handleAlertPress(alert)}
                                        activeOpacity={0.75}
                                    >
                                        <View style={[styles.alertIconBox, { backgroundColor: alertColor + '20' }]}>
                                            <Icon source={getAlertIcon(alert)} size={22} color={alertColor} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                {alert.flag && (
                                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: FLAG_COLORS[alert.flag] }} />
                                                )}
                                                <Text style={styles.alertType}>{alert.title}</Text>
                                            </View>
                                            <View style={styles.alertMeta}>
                                                <Icon source="map-marker" size={12} color={colors.mutedForeground} />
                                                <Text style={styles.alertMetaText}>
                                                    {alert.location || t('home.allAreas')} · {alert.time}
                                                </Text>
                                            </View>
                                        </View>
                                        <Icon source="chevron-right" size={18} color={colors.mutedForeground} />
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            !loading && (
                                <View style={styles.emptyState}>
                                    <Icon source="check-decagram" size={48} color={colors.success} />
                                    <Text style={styles.emptyTitle}>{t('home.noAlerts')}</Text>
                                    <Text style={styles.emptyText}>{t('home.noAlertsDesc')}</Text>
                                </View>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Floating SOS */}
            {/* <TouchableOpacity style={styles.sosFab} activeOpacity={0.8}>
                <Icon source="alarm-light" size={28} color="#fff" />
            </TouchableOpacity> */}

            {/* Feedback Snackbar */}
            <Snackbar
                visible={!!feedbackSent}
                onDismiss={() => setFeedbackSent(null)}
                duration={3000}
                style={{ backgroundColor: colors.inverseSurface }}
            >
                <Text style={{ color: colors.inverseOnSurface }}>
                    Response sent: {feedbackSent}
                </Text>
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    greeting: { fontSize: 14, color: colors.mutedForeground },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground, letterSpacing: -0.5 },
    bellBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    bellDot: { position: 'absolute', right: 4, top: 4, width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444', borderWidth: 2, borderColor: colors.background },
    statusBanner: { marginTop: spacing.l, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: 20 },
    statusIcon: { width: 56, height: 56, borderRadius: borderRadius.md, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    statusTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
    statusSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginTop: 32, marginBottom: 12 },
    quickGrid: { flexDirection: 'row', gap: 12 },
    quickCard: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: colors.card, borderRadius: borderRadius.lg, paddingVertical: 20 },
    quickIconBox: { width: 48, height: 48, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
    quickLabel: { fontSize: 12, fontWeight: '600', color: colors.foreground },
    checklistCard: { marginTop: 32, backgroundColor: colors.accent, borderRadius: borderRadius.lg, padding: 20 },
    checklistHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    checklistTitle: { fontSize: 16, fontWeight: '700', color: colors.accentForeground },
    viewAllText: { fontSize: 14, fontWeight: '600', color: colors.primary },
    checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkmark: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    checkmarkText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    checklistItemText: { fontSize: 14, color: colors.accentForeground },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 12 },
    alertCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16 },
    alertIconBox: { width: 48, height: 48, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
    alertType: { fontSize: 14, fontWeight: '700', color: colors.foreground },
    alertMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    alertMetaText: { fontSize: 12, color: colors.mutedForeground },
    emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground },
    emptyText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
    sosFab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});
