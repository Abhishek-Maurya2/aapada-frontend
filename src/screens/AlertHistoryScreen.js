import React, { useEffect, useState } from 'react';
import {
    View, ScrollView, StyleSheet, TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import api from '../services/api';
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';

const SEVERITY_CONFIG = {
    CRITICAL: { bg: '#FEE2E2', text: '#B91C1C', label: 'CRITICAL' },
    HIGH: { bg: '#FFEDD5', text: '#C2410C', label: 'HIGH' },
    MEDIUM: { bg: '#FEF3C7', text: '#A16207', label: 'MEDIUM' },
    LOW: { bg: '#DCFCE7', text: '#15803D', label: 'LOW' },
};

const RESPONSE_COLORS = {
    SAFE: { bg: '#DCFCE7', text: '#15803D', icon: 'check-circle' },
    MEDICAL: { bg: '#FEE2E2', text: '#B91C1C', icon: 'hospital-box' },
    FIRE: { bg: '#FFEDD5', text: '#C2410C', icon: 'fire' },
    HELP: { bg: '#E4D4F4', text: colors.primary, icon: 'hand-wave' },
    ACKNOWLEDGED: { bg: '#E0F2FE', text: '#0369A1', icon: 'check' },
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

export default function AlertHistoryScreen({ navigation }) {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const respondedAlertIds = useStore((state) => state.respondedAlertIds);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/alerts');
            if (response.data.success) {
                const allAlerts = response.data.data;
                const respondedAlerts = allAlerts
                    .filter(alert => respondedAlertIds.includes(alert._id))
                    .map(alert => ({
                        id: alert._id,
                        title: alert.title || 'Alert',
                        severity: alert.severity || 'LOW',
                        location: typeof alert.targetRegion === 'string'
                            ? alert.targetRegion
                            : (alert.targetRegion?.type === 'Point'
                                ? `Geofenced Area (${alert.targetRegion.radius}m)`
                                : t('home.allAreas')),
                        response: 'ACKNOWLEDGED',
                        time: new Date(alert.createdAt).toLocaleDateString(),
                    }));
                setHistory(respondedAlerts);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [respondedAlertIds]);

    const FILTERS = ['all', 'SAFE', 'MEDICAL', 'FIRE', 'HELP'];

    const filteredHistory = filter === 'all'
        ? history
        : history.filter(h => h.response === filter);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchHistory} colors={[colors.primary]} />
                }
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon source="arrow-left" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{t('alertHistory.title')}</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{history.length}</Text>
                        </View>
                    </View>

                    {/* Filter Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow} style={{ marginTop: 20 }}>
                        {FILTERS.map((f) => {
                            const isActive = filter === f;
                            return (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => setFilter(f)}
                                    style={[styles.filterChip, isActive ? styles.filterChipActive : styles.filterChipInactive]}
                                >
                                    <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
                                        {f === 'all' ? t('alertHistory.all') : f}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* History List */}
                    <View style={{ gap: 12, marginTop: 20, paddingBottom: 32 }}>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => {
                                const sevConfig = SEVERITY_CONFIG[item.severity?.toUpperCase()] || SEVERITY_CONFIG.LOW;
                                const respConfig = RESPONSE_COLORS[item.response] || RESPONSE_COLORS.ACKNOWLEDGED;
                                const alertColor = getSeverityColor(item.severity);
                                return (
                                    <View key={item.id} style={styles.historyCard}>
                                        <View style={styles.cardRow}>
                                            <View style={[styles.iconBox, { backgroundColor: alertColor + '20' }]}>
                                                <Icon source={getSeverityIcon(item.severity)} size={22} color={alertColor} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={styles.titleRow}>
                                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                                    <View style={[styles.sevPill, { backgroundColor: sevConfig.bg }]}>
                                                        <Text style={[styles.sevPillText, { color: sevConfig.text }]}>{sevConfig.label}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.cardMeta}>{item.location} · {item.time}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.responseChip, { backgroundColor: respConfig.bg }]}>
                                            <Icon source={respConfig.icon} size={14} color={respConfig.text} />
                                            <Text style={[styles.responseText, { color: respConfig.text }]}>{item.response}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            !loading && (
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIcon}>
                                        <Icon source="history" size={48} color={colors.primary} />
                                    </View>
                                    <Text style={styles.emptyTitle}>{t('alertHistory.noHistory')}</Text>
                                    <Text style={styles.emptyText}>{t('alertHistory.noHistoryDesc')}</Text>
                                </View>
                            )
                        )}
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
    countBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    countText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    filtersRow: { gap: 8 },
    filterChip: { borderRadius: borderRadius.full, paddingHorizontal: 20, paddingVertical: 10 },
    filterChipActive: { backgroundColor: colors.primary },
    filterChipInactive: { backgroundColor: colors.card },
    filterText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
    filterTextActive: { color: '#fff' },
    filterTextInactive: { color: colors.foreground },
    historyCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16 },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 48, height: 48, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground },
    sevPill: { borderRadius: borderRadius.full, paddingHorizontal: 8, paddingVertical: 2 },
    sevPillText: { fontSize: 10, fontWeight: '700' },
    cardMeta: { fontSize: 12, color: colors.mutedForeground, marginTop: 4 },
    responseChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, borderRadius: borderRadius.full, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
    responseText: { fontSize: 12, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
    emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground },
    emptyText: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center' },
});
