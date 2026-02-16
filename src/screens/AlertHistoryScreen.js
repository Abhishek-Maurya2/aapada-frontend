import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text, Chip, Appbar, Surface, Icon, useTheme } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';
import api from '../services/api';

const getSeverityConfig = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return { bg: '#F9DEDC', color: '#B3261E' };
        case 'HIGH':
            return { bg: '#FFDBCF', color: '#C4441C' };
        case 'MEDIUM':
            return { bg: '#FFDEA9', color: '#795900' };
        default:
            return { bg: '#C4EECD', color: '#006D3A' };
    }
};

const getResponseConfig = (response) => {
    switch (response?.toUpperCase()) {
        case 'SAFE':
            return { icon: 'check-circle', bg: '#C4EECD', color: '#006D3A' };
        case 'MEDICAL':
            return { icon: 'hospital-box', bg: '#F9DEDC', color: '#B3261E' };
        case 'FIRE':
            return { icon: 'fire', bg: '#FFDEA9', color: '#795900' };
        case 'HELP':
            return { icon: 'hand-wave', bg: '#EADDFF', color: '#6750A4' };
        default:
            return { icon: 'message-alert', bg: '#E7E0EC', color: '#49454F' };
    }
};

const HistoryCard = ({ item }) => {
    const sev = getSeverityConfig(item.severity);
    const resp = getResponseConfig(item.userResponse);

    return (
        <Card style={styles.card} mode="elevated">
            <View style={[styles.indicator, { backgroundColor: sev.color }]} />
            <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                    <Chip
                        icon={resp.icon}
                        style={{ backgroundColor: resp.bg }}
                        textStyle={{ color: resp.color, fontSize: 11, fontWeight: '600' }}
                        compact
                    >
                        {item.userResponse}
                    </Chip>
                </View>

                <View style={styles.locationRow}>
                    <Icon source="map-marker" size={14} color={colors.primary} />
                    <Text variant="bodyMedium" style={{ color: colors.primary, marginLeft: 4 }}>
                        {item.targetRegion || 'All Areas'}
                    </Text>
                </View>

                <Text variant="bodySmall" numberOfLines={2} style={styles.cardDescription}>
                    {item.message}
                </Text>

                <View style={styles.timeRow}>
                    <Icon source="clock-check-outline" size={14} color={colors.outline} />
                    <Text variant="labelSmall" style={{ color: colors.outline, marginLeft: 4 }}>
                        Responded: {new Date(item.respondedAt).toLocaleString()}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default function AlertHistoryScreen({ navigation }) {
    const { user } = useStore();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const response = await api.get(`/alerts/history/${user.id}`);
            if (response.data.success) {
                setHistory(response.data.data);
            } else {
                setHistory([]);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.id]);

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar} elevated={false}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Alert History"
                    titleStyle={{ fontWeight: '700', color: colors.onSurface }}
                />
            </Appbar.Header>

            <FlatList
                data={history}
                renderItem={({ item }) => <HistoryCard item={item} />}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchHistory}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <Surface style={styles.emptyIcon} elevation={0}>
                                <Icon source="history" size={48} color={colors.primary} />
                            </Surface>
                            <Text variant="headlineSmall" style={styles.emptyTitle}>
                                No History Yet
                            </Text>
                            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                                Alerts you respond to will appear here.
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    appbar: {
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.l,
    },
    card: {
        marginBottom: spacing.m,
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor: colors.surfaceContainerLow,
    },
    cardContent: {
        paddingLeft: spacing.l,
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
        marginRight: spacing.m,
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
    },
    indicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    emptyState: {
        padding: spacing.xl * 2,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.primaryContainer,
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
