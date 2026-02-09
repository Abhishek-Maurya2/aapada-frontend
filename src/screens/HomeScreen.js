import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, Chip, Avatar, IconButton, ActivityIndicator, Snackbar, Divider, useTheme } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';

const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return colors.error;
        case 'HIGH': return colors.accent;
        case 'MEDIUM': return '#F59E0B';
        default: return colors.success;
    }
};

const AlertCard = ({ alert, onPress, onAction }) => {
    const theme = useTheme();

    return (
        <Card style={styles.card} onPress={() => onPress(alert)} mode="elevated">
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleLarge" style={styles.cardTitle}>{alert.title}</Text>
                    <Chip
                        style={{ backgroundColor: getSeverityColor(alert.severity) }}
                        textStyle={{ color: '#fff', fontWeight: 'bold' }}
                        compact
                    >
                        {alert.severity}
                    </Chip>
                </View>

                <View style={styles.locationRow}>
                    <IconButton icon="map-marker" size={16} iconColor={theme.colors.primary} style={{ margin: 0 }} />
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                        {alert.location || 'All Areas'}
                    </Text>
                </View>

                <Text variant="bodyMedium" numberOfLines={2} style={styles.cardDescription}>
                    {alert.description}
                </Text>

                <Text variant="labelSmall" style={styles.cardTime}>Received: {alert.time}</Text>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button
                    mode="outlined"
                    icon="hospital-box"
                    textColor={colors.error}
                    style={{ borderColor: colors.error }}
                    onPress={() => onAction(alert.id, 'MEDICAL')}
                    compact
                >
                    Medical
                </Button>
                <Button
                    mode="outlined"
                    icon="fire-truck"
                    textColor='#F59E0B'
                    style={{ borderColor: '#F59E0B' }}
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
        // Fetch immediately on mount (with loading indicator)
        fetchAlerts();

        // Poll for new alerts every 5 seconds SILENTLY (no loading indicator)
        const pollInterval = setInterval(() => {
            fetchAlerts(true); // true = silent mode, no UI refresh
        }, 5000);

        // Cleanup on unmount
        return () => clearInterval(pollInterval);
    }, []);

    const handleAlertPress = (alert) => {
        navigation.navigate('AlertDetail', { alert });
    };

    const handleAction = async (alertId, actionType) => {
        // Stop the alarm when user responds
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header with Profile */}
            <View style={styles.header}>
                <View>
                    <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Hello, {user?.name || 'User'} 👋</Text>
                    <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Active Alerts</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Avatar.Text size={48} label={getInitials(user?.name)} style={{ backgroundColor: theme.colors.primary }} />
                </TouchableOpacity>
            </View>

            {/* Stats Bar */}
            <View style={[styles.statsBar, { borderColor: theme.colors.outline }]}>
                <View style={styles.statItem}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{alerts.length}</Text>
                    <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>Active</Text>
                </View>
                <Divider style={{ width: 1, height: '100%', backgroundColor: theme.colors.outline }} />
                <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('AlertHistory')}>
                    <IconButton icon="clipboard-text-clock" size={24} />
                    <Text variant="labelMedium" style={{ color: theme.colors.secondary, marginTop: -10 }}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Alert List */}
            <FlatList
                data={alerts}
                renderItem={({ item }) => (
                    <AlertCard
                        alert={item}
                        onPress={handleAlertPress}
                        onAction={handleAction}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchAlerts}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>🎉</Text>
                            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>All Clear!</Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>No active alerts in your area. Stay safe!</Text>
                        </View>
                    )
                }
            />

            {/* Feedback Toast */}
            <Snackbar
                visible={!!feedbackSent}
                onDismiss={() => setFeedbackSent(null)}
                duration={3000}
                style={{ backgroundColor: colors.success }}
            >
                <Text style={{ color: '#fff' }}>Response sent: {feedbackSent}</Text>
            </Snackbar>
        </SafeAreaView>
    );
}

// Need to keep TouchableOpacity for custom composed buttons that aren't fully Paper friendly in layout yet
// But I replaced most with Paper equivalents.
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: colors.surface,
        marginHorizontal: spacing.l,
        marginBottom: spacing.m,
        borderRadius: 12,
        padding: spacing.m,
        borderWidth: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: spacing.l,
        paddingTop: 0,
    },
    card: {
        marginBottom: spacing.m,
        backgroundColor: colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xs,
    },
    cardTitle: {
        flex: 1,
        fontWeight: 'bold',
        marginRight: spacing.s,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -10, // Offset icon padding
        marginBottom: spacing.xs,
    },
    cardDescription: {
        color: colors.textSecondary,
        marginBottom: spacing.s,
    },
    cardTime: {
        color: colors.textSecondary,
        marginTop: spacing.xs,
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
    emptyEmoji: {
        fontSize: 64,
        marginBottom: spacing.m,
    },
});

