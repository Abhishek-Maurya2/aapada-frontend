import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Chip, Divider, Surface, useTheme } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';

const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return colors.error;
        case 'high': return colors.accent;
        case 'medium': return '#F59E0B';
        default: return colors.success;
    }
};

export default function AlertDetailScreen({ route, navigation }) {
    const { alert } = route.params;
    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Surface style={styles.headerImagePlaceholder} elevation={2}>
                    {/* Placeholder for Map or Impact Image */}
                    <Chip
                        style={{ backgroundColor: getSeverityColor(alert.severity), alignSelf: 'flex-start' }}
                        textStyle={{ color: '#fff', fontWeight: 'bold' }}
                    >
                        {alert.severity.toUpperCase()}
                    </Chip>
                </Surface>

                <Surface style={[styles.detailsContainer, { backgroundColor: theme.colors.background }]} elevation={0}>
                    <Text variant="headlineMedium" style={styles.title}>{alert.title}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>Location</Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{alert.location}</Text>
                        </View>
                        <Divider style={{ width: 1, height: '100%', backgroundColor: theme.colors.outline }} />
                        <View style={styles.metaItem}>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>Time</Text>
                            <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{alert.time}</Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: spacing.m }} />

                    <View style={styles.section}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Description</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{alert.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Instructions</Text>
                        <Text variant="bodyMedium" style={styles.instructionItem}>• Stay indoors and away from windows.</Text>
                        <Text variant="bodyMedium" style={styles.instructionItem}>• Keep emergency kits ready.</Text>
                        <Text variant="bodyMedium" style={styles.instructionItem}>• Listen to official broadcasts only.</Text>
                    </View>
                </Surface>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.outline }]}>
                <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    buttonColor={colors.success}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    I am Safe / Acknowledge
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerImagePlaceholder: {
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: spacing.l,
        backgroundColor: colors.surfaceHighlight, // Still use this for placeholder bg
    },
    detailsContainer: {
        flex: 1,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.l,
        paddingTop: spacing.xl,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: spacing.l,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.m,
        padding: spacing.m,
        borderRadius: 12,
        backgroundColor: colors.surface, // Keep consistent background for meta box
    },
    metaItem: {
        flex: 1,
        alignItems: 'center',
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    instructionItem: {
        marginBottom: spacing.xs,
        color: colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.l,
        borderTopWidth: 1,
    },
});

