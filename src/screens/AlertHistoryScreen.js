import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Chip, Appbar, useTheme, ActivityIndicator } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';
import api from '../services/api';

const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return colors.error;
        case 'HIGH': return colors.accent;
        case 'MEDIUM': return '#F59E0B';
        default: return colors.success;
    }
};

const getResponseIcon = (response) => {
    switch (response?.toUpperCase()) {
        case 'SAFE': return 'check-circle';
        case 'MEDICAL': return 'hospital-box';
        case 'FIRE': return 'fire-truck';
        case 'HELP': return 'alert-circle';
        default: return 'message-alert';
    }
};

const HistoryCard = ({ item }) => {
    const theme = useTheme();

    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                    <Chip
                        icon={getResponseIcon(item.userResponse)}
                        style={{ backgroundColor: theme.colors.surfaceVariant }}
                        textStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}
                        compact
                    >
                        {item.userResponse}
                    </Chip>
                </View>

                <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginBottom: spacing.xs }}>
                    📍 {item.targetRegion || 'All Areas'}
                </Text>

                <Text variant="bodySmall" numberOfLines={2} style={styles.cardDescription}>
                    {item.message}
                </Text>

                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.s }}>
                    Responded: {new Date(item.respondedAt).toLocaleString()}
                </Text>
            </Card.Content>
            <View style={[styles.indicator, { backgroundColor: getSeverityColor(item.severity) }]} />
        </Card>
    );
};

export default function AlertHistoryScreen({ navigation }) {
    const { user } = useStore();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const fetchHistory = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Mock data for now if API fails or isn't ready, but structure implies API exists
            // const response = await api.get(`/alerts/history/${user.id}`);
            // if (response.data.success) {
            //     setHistory(response.data.data);
            // }

            // Using mock data to ensure UI renders for this task if API isn't fully ready with history
            // In real scenario, uncomment above and remove this if API is ready
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Alert History" />
            </Appbar.Header>

            <FlatList
                data={history}
                renderItem={({ item }) => <HistoryCard item={item} />}
                keyExtractor={(item) => item._id || Math.random().toString()} // Fallback key
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchHistory}
                        tintColor={theme.colors.primary}
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📭</Text>
                            <Text variant="headlineSmall" style={styles.emptyTitle}>No History Yet</Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.secondary, textAlign: 'center' }}>
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
    },
    listContent: {
        padding: spacing.l,
    },
    card: {
        marginBottom: spacing.m,
        overflow: 'hidden', // For the indicator strip
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
        marginRight: spacing.m,
    },
    cardDescription: {
        color: colors.textSecondary,
    },
    indicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 4,
    },
    emptyState: {
        padding: spacing.xl * 2,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: spacing.m,
    },
    emptyTitle: {
        marginBottom: spacing.s,
        fontWeight: 'bold',
    },
});

