import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Card, Text, Button, Chip, Avatar, IconButton,
    Snackbar, Divider, Surface, Icon, useTheme,
} from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';

const getSeverityConfig = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return { bg: '#F9DEDC', text: '#410E0B', badge: '#B3261E', badgeText: '#fff' };
        case 'HIGH':
            return { bg: '#FFDBCF', text: '#380D00', badge: '#C4441C', badgeText: '#fff' };
        case 'MEDIUM':
            return { bg: '#FFDEA9', text: '#261A00', badge: '#795900', badgeText: '#fff' };
        default:
            return { bg: '#C4EECD', text: '#002110', badge: '#006D3A', badgeText: '#fff' };
    }
};

const AlertCard = ({ alert, onPress, onAction }) => {
    const sev = getSeverityConfig(alert.severity);

    return (
        <Card
            style={[styles.card, { backgroundColor: colors.surfaceContainerLow }]}
            onPress={() => onPress(alert)}
            mode="elevated"
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleLarge" style={styles.cardTitle}>{alert.title}</Text>
                    <Chip
                        style={{ backgroundColor: sev.badge }}
                        textStyle={{ color: sev.badgeText, fontWeight: '700', fontSize: 11 }}
                        compact
                    >
                        {alert.severity}
                    </Chip>
                </View>

                <View style={styles.locationRow}>
                    <Icon source="map-marker" size={16} color={colors.primary} />
                    <Text variant="bodyMedium" style={{ color: colors.primary, marginLeft: 4 }}>
                        {alert.location || 'All Areas'}
                    </Text>
                </View>

                <Text variant="bodyMedium" numberOfLines={2} style={styles.cardDescription}>
                    {alert.description}
                </Text>

                <View style={styles.timeRow}>
                    <Icon source="clock-outline" size={14} color={colors.outline} />
                    <Text variant="labelSmall" style={styles.cardTime}>Received: {alert.time}</Text>
                </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    icon="hospital-box"
                    textColor={colors.error}
                    style={{ borderColor: colors.error, borderRadius: 20 }}
                    onPress={() => onAction(alert.id, 'MEDICAL')}
                    compact
                >
                    Medical
                </Button>
                <Button
                    mode="outlined"
                    icon="fire"
                    textColor="#795900"
                    style={{ borderColor: '#795900', borderRadius: 20 }}
                    onPress={() => onAction(alert.id, 'FIRE')}
                    compact
                >
                    Fire
                </Button>
                <Button
                    mode="contained"
                    icon="check-circle"
                    buttonColor={colors.success}
                    onPress={() => onAction(alert.id, 'SAFE')}
                    style={{ borderRadius: 20 }}
                    compact
                >
                    I'm Safe
                </Button>
            </Card.Actions>
        </Card>
    );
};

export default function HomeScreen({ navigation }) {
    const { alerts, loading, fetchAlerts, user, sendFeedback, dismissAlarm } = useStore();
    const [feedbackSent, setFeedbackSent] = useState(null);
    const theme = useTheme();

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

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text variant="labelLarge" style={{ color: colors.primary }}>
                        Hello, {user?.name || 'User'} 👋
                    </Text>
                    <Text variant="headlineMedium" style={{ fontWeight: '800', color: colors.onSurface }}>
                        Active Alerts
                    </Text>
                </View>
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    <Avatar.Text
                        size={48}
                        label={getInitials(user?.name)}
                        style={{ backgroundColor: colors.primaryContainer }}
                        labelStyle={{ color: colors.onPrimaryContainer }}
                    />
                </Pressable>
            </View>

            {/* Stats Bar */}
            <Surface style={styles.statsBar} elevation={0}>
                <View style={styles.statItem}>
                    <Text variant="headlineSmall" style={{ fontWeight: '800', color: colors.primary }}>
                        {alerts.length}
                    </Text>
                    <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Active</Text>
                </View>
                <Divider style={styles.statDivider} />
                <Pressable style={styles.statItem} onPress={() => navigation.navigate('AlertHistory')}>
                    <Icon source="clipboard-text-clock" size={24} color={colors.tertiary} />
                    <Text variant="labelMedium" style={{ color: colors.tertiary, marginTop: 2 }}>
                        History
                    </Text>
                </Pressable>
            </Surface>

            {/* Alert List */}
            <FlatList
                data={alerts}
                renderItem={({ item }) => (
                    <AlertCard alert={item} onPress={handleAlertPress} onAction={handleAction} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchAlerts}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <Surface style={styles.emptyIcon} elevation={0}>
                                <Icon source="check-decagram" size={48} color={colors.success} />
                            </Surface>
                            <Text variant="headlineSmall" style={styles.emptyTitle}>All Clear!</Text>
                            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                                No active alerts in your area. Stay safe!
                            </Text>
                        </View>
                    )
                }
            />

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
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.l,
        paddingBottom: spacing.m,
    },
    statsBar: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceContainerLow,
        marginHorizontal: spacing.l,
        marginBottom: spacing.m,
        borderRadius: 20,
        padding: spacing.m,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.outlineVariant,
    },
    listContent: {
        padding: spacing.l,
        paddingTop: 0,
    },
    card: {
        marginBottom: spacing.m,
        borderRadius: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xs,
    },
    cardTitle: {
        flex: 1,
        fontWeight: '700',
        color: colors.onSurface,
        marginRight: spacing.s,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    cardDescription: {
        color: colors.onSurfaceVariant,
        marginBottom: spacing.s,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardTime: {
        color: colors.outline,
    },
    cardActions: {
        justifyContent: 'space-between',
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.m,
    },
    emptyState: {
        padding: spacing.xl * 2,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.successContainer || '#C4EECD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    emptyTitle: {
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: spacing.s,
    },
});
