import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Chip, Surface, Icon, useTheme } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';

const getSeverityConfig = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return { bg: '#F9DEDC', color: '#B3261E', label: 'CRITICAL' };
        case 'HIGH':
            return { bg: '#FFDBCF', color: '#C4441C', label: 'HIGH' };
        case 'MEDIUM':
            return { bg: '#FFDEA9', color: '#795900', label: 'MEDIUM' };
        default:
            return { bg: '#C4EECD', color: '#006D3A', label: 'LOW' };
    }
};

export default function AlertDetailScreen({ route, navigation }) {
    const { alert } = route.params;
    const sev = getSeverityConfig(alert.severity);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Banner */}
                <Surface style={[styles.heroBanner, { backgroundColor: sev.bg }]} elevation={0}>
                    <View style={styles.heroContent}>
                        <Chip
                            style={{ backgroundColor: sev.color, alignSelf: 'flex-start' }}
                            textStyle={{ color: '#fff', fontWeight: '700' }}
                        >
                            {sev.label}
                        </Chip>
                        <Text variant="headlineMedium" style={[styles.heroTitle, { color: sev.color }]}>
                            {alert.title}
                        </Text>
                    </View>
                </Surface>

                {/* Details */}
                <View style={styles.details}>
                    {/* Info Row */}
                    <View style={styles.infoRow}>
                        <Surface style={styles.infoCard} elevation={0}>
                            <Icon source="map-marker" size={22} color={colors.primary} />
                            <Text variant="labelMedium" style={styles.infoLabel}>Location</Text>
                            <Text variant="titleSmall" style={styles.infoValue}>
                                {alert.location || 'All Areas'}
                            </Text>
                        </Surface>
                        <Surface style={styles.infoCard} elevation={0}>
                            <Icon source="clock-outline" size={22} color={colors.primary} />
                            <Text variant="labelMedium" style={styles.infoLabel}>Time</Text>
                            <Text variant="titleSmall" style={styles.infoValue}>
                                {alert.time}
                            </Text>
                        </Surface>
                    </View>

                    {/* Description */}
                    <Surface style={styles.section} elevation={0}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                        <Text variant="bodyLarge" style={styles.sectionBody}>
                            {alert.description}
                        </Text>
                    </Surface>

                    {/* Instructions */}
                    <Surface style={styles.section} elevation={0}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Safety Instructions</Text>
                        <View style={styles.instructionRow}>
                            <Icon source="shield-check" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Stay indoors and away from windows.
                            </Text>
                        </View>
                        <View style={styles.instructionRow}>
                            <Icon source="bag-personal" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Keep emergency kits ready.
                            </Text>
                        </View>
                        <View style={styles.instructionRow}>
                            <Icon source="radio" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Listen to official broadcasts only.
                            </Text>
                        </View>
                    </Surface>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    buttonColor={colors.success}
                    contentStyle={{ paddingVertical: 8 }}
                    style={{ borderRadius: 20 }}
                    labelStyle={{ fontSize: 16, fontWeight: '700' }}
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
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    heroBanner: {
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: spacing.l,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    heroContent: {
        gap: 12,
    },
    heroTitle: {
        fontWeight: '800',
    },
    details: {
        padding: spacing.l,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: spacing.l,
    },
    infoCard: {
        flex: 1,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        color: colors.onSurfaceVariant,
    },
    infoValue: {
        fontWeight: '700',
        color: colors.onSurface,
    },
    section: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 20,
        padding: 20,
        marginBottom: spacing.m,
    },
    sectionTitle: {
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 10,
    },
    sectionBody: {
        color: colors.onSurfaceVariant,
        lineHeight: 24,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    instructionText: {
        color: colors.onSurfaceVariant,
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.l,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
    },
});
