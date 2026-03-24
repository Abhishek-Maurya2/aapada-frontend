import React, { useState, useEffect } from 'react';
import {
    View, ScrollView, StyleSheet, TouchableOpacity, Linking, Share, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, Surface } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useTranslation } from 'react-i18next';
import { getPrecautionsForAlert } from '../data/alertPrecautions';

const { width } = Dimensions.get('window');

const SEVERITY_CONFIG = {
    CRITICAL: { bg: '#FEE2E2', text: '#B91C1C', label: 'CRITICAL', flag: '#EF4444' },
    HIGH: { bg: '#FFEDD5', text: '#C2410C', label: 'HIGH', flag: '#F97316' },
    MEDIUM: { bg: '#FEF3C7', text: '#A16207', label: 'MEDIUM', flag: '#EAB308' },
    LOW: { bg: '#DCFCE7', text: '#15803D', label: 'LOW', flag: '#22C55E' },
};

const FLAG_COLORS = {
    RED: '#EF4444',
    ORANGE: '#F97316',
    YELLOW: '#EAB308',
    GREEN: '#22C55E'
};

export default function AlertDetailScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { alert } = route.params;
    const sevConfig = SEVERITY_CONFIG[alert.severity?.toUpperCase()] || SEVERITY_CONFIG.LOW;
    const alertData = getPrecautionsForAlert(alert);

    const [timeLeft, setTimeLeft] = useState('');
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        if (!alert.expiresAt) {
            setTimeLeft('');
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const expiry = new Date(alert.expiresAt);
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (h > 24) {
                setTimeLeft(`Expires in ${Math.floor(h / 24)}d ${h % 24}h`);
            } else if (h > 0) {
                setTimeLeft(`Expires in ${h}h ${m}m`);
            } else {
                setTimeLeft(`Expires in ${m}m`);
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000);
        return () => clearInterval(timer);
    }, [alert.expiresAt]);

    const handleAction = (actionId) => {
        switch (actionId) {
            case '112':
            case 'fire_dept':
                Linking.openURL(`tel:${actionId === '112' ? '112' : '101'}`);
                break;
            case 'share':
                Share.share({
                    message: `${alert.title}\n\n${alert.message}\n\nLocation: ${alert.location || 'All areas'}\n\nShared via Aapada App`,
                });
                break;
            case 'safe_zones':
                // Placeholder navigation
                break;
            default:
                console.log('Action handled:', actionId);
        }
    };

    const displayFlagColor = alert.flag ? FLAG_COLORS[alert.flag] : sevConfig.flag;

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
                            <Text style={styles.headerTitle}>{alert.alertType || 'Alert'} Details</Text>
                        </View>
                        <View style={[styles.flagBadge, { backgroundColor: displayFlagColor }]}>
                            <Icon source="flag-variant" size={14} color="#fff" />
                            <Text style={styles.flagText}>{alert.flag || alert.severity}</Text>
                        </View>
                    </View>

                    {/* Banner Section */}
                    <Surface style={[styles.mainCard, { borderColor: displayFlagColor + '40' }]} elevation={2}>
                        <View style={[styles.cardHeader, { backgroundColor: displayFlagColor + '10' }]}>
                            <View style={[styles.iconBox, { backgroundColor: displayFlagColor }]}>
                                <Icon source={alertData.icon} size={28} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{alert.title}</Text>
                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <Icon source="map-marker" size={14} color={colors.mutedForeground} />
                                        <Text style={styles.metaText}>{alert.location || 'All Areas'}</Text>
                                    </View>
                                    {timeLeft ? (
                                        <View style={styles.metaItem}>
                                            <Icon source="clock-outline" size={14} color={timeLeft === 'Expired' ? colors.error : colors.mutedForeground} />
                                            <Text style={[styles.metaText, timeLeft === 'Expired' ? { color: colors.error, fontWeight: '700' } : null]}>
                                                {timeLeft}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={styles.description}>{alert.message || alert.description}</Text>

                            {alert.additionalInfo ? (
                                <View style={styles.additionalInfoBox}>
                                    <Text style={styles.additionalInfoTitle}>Additional Information</Text>
                                    <Text style={styles.additionalInfoText}>{alert.additionalInfo}</Text>
                                </View>
                            ) : null}
                        </View>
                    </Surface>

                    {/* Precautionary Measures */}
                    <Text style={styles.sectionTitle}>Safety Instructions</Text>
                    <View style={styles.precautionsContainer}>
                        {alertData.precautions.map((item, index) => (
                            <View key={index} style={styles.precautionItem}>
                                <View style={[styles.precautionNum, { backgroundColor: displayFlagColor + '20' }]}>
                                    <Text style={[styles.precautionNumText, { color: displayFlagColor }]}>{index + 1}</Text>
                                </View>
                                <Text style={styles.precautionText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {alertData.actions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.actionButton}
                                onPress={() => handleAction(action.id)}
                                activeOpacity={0.7}
                            >
                                <Surface style={styles.actionIconSurface} elevation={1}>
                                    <Icon source={action.icon} size={24} color={colors.primary} />
                                </Surface>
                                <Text style={styles.actionButtonLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleAction('share')}
                            activeOpacity={0.7}
                        >
                            <Surface style={styles.actionIconSurface} elevation={1}>
                                <Icon source="share-variant" size={24} color={colors.primary} />
                            </Surface>
                            <Text style={styles.actionButtonLabel}>Share Alert</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Response Section */}
                    <TouchableOpacity
                        style={[styles.safeBtn, { borderColor: colors.primary }]}
                        onPress={() => navigation.navigate('EmergencyAlert', { alert })}
                        activeOpacity={0.8}
                    >
                        <View style={styles.safeCheckmark}>
                            <Text style={styles.safeCheckText}>✓</Text>
                        </View>
                        <Text style={styles.safeBtnText}>I am safe, don't worry</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.l },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground },
    flagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    flagText: { fontSize: 10, fontWeight: '900', color: '#fff', textTransform: 'uppercase' },

    mainCard: { backgroundColor: colors.card, borderRadius: 24, overflow: 'hidden', borderWidth: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
    iconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, color: colors.mutedForeground },

    cardBody: { padding: 16 },
    description: { fontSize: 15, color: colors.foreground, lineHeight: 22 },
    additionalInfoBox: { marginTop: 16, padding: 12, backgroundColor: colors.background, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.primary },
    additionalInfoTitle: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 },
    additionalInfoText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },

    sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground, marginTop: 24, marginBottom: 16 },
    precautionsContainer: { gap: 12 },
    precautionItem: { flexDirection: 'row', gap: 12, backgroundColor: colors.card, padding: 12, borderRadius: 16 },
    precautionNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    precautionNumText: { fontSize: 14, fontWeight: '800' },
    precautionText: { flex: 1, fontSize: 14, color: colors.foreground, lineHeight: 20 },

    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
    actionButton: { width: (width - spacing.l * 2 - 24) / 3, alignItems: 'center', gap: 8 },
    actionIconSurface: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    actionButtonLabel: { fontSize: 11, fontWeight: '600', color: colors.mutedForeground, textAlign: 'center' },

    safeBtn: { marginTop: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.card, borderWidth: 2, borderRadius: 20, paddingVertical: 18, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    safeCheckmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    safeCheckText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    safeBtnText: { fontSize: 16, fontWeight: '800', color: colors.primary },
});

