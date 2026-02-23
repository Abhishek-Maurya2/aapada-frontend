import React, { useEffect, useRef } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar as RNStatusBar,
} from 'react-native';
import {
    Text,
    Button,
    Surface,
    Icon,
    Chip,
    Divider,
    IconButton,
} from 'react-native-paper';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';

const { width } = Dimensions.get('window');

// M3 Expressive color tokens per severity
const getSeverityTheme = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return {
                container: '#FFDAD6',       // errorContainer
                onContainer: '#410002',      // onErrorContainer
                accent: '#BA1A1A',           // error
                onAccent: '#FFFFFF',
                surface: '#FFF8F7',          // surface
                badge: '#BA1A1A',
                badgeText: '#FFFFFF',
                icon: 'alert-octagon',
                label: 'CRITICAL',
                headerBg: '#FFB4AB',
            };
        case 'HIGH':
            return {
                container: '#FFDBCF',
                onContainer: '#380D00',
                accent: '#C4441C',
                onAccent: '#FFFFFF',
                surface: '#FFFBFF',
                badge: '#C4441C',
                badgeText: '#FFFFFF',
                icon: 'alert',
                label: 'HIGH',
                headerBg: '#FFB59E',
            };
        case 'MEDIUM':
            return {
                container: '#FFDEA9',
                onContainer: '#261A00',
                accent: '#795900',
                onAccent: '#FFFFFF',
                surface: '#FFFBFF',
                badge: '#795900',
                badgeText: '#FFFFFF',
                icon: 'alert-circle',
                label: 'MEDIUM',
                headerBg: '#FFDF9B',
            };
        default:
            return {
                container: '#C4EECD',
                onContainer: '#002110',
                accent: '#006D3A',
                onAccent: '#FFFFFF',
                surface: '#FBFDF7',
                badge: '#006D3A',
                badgeText: '#FFFFFF',
                icon: 'information',
                label: 'ADVISORY',
                headerBg: '#A7D8B3',
            };
    }
};

export default function EmergencyAlertScreen({ route, navigation }) {
    const { alert } = route.params;
    const { sendFeedback, dismissAlarm } = useStore();
    const theme = getSeverityTheme(alert.severity);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const iconBounce = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const buttonsAnim = useRef(new Animated.Value(60)).current;

    useEffect(() => {
        // Entrance animations
        Animated.stagger(100, [
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 65,
                    friction: 9,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(iconBounce, {
                toValue: 1,
                tension: 80,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.spring(buttonsAnim, {
                toValue: 0,
                tension: 50,
                friction: 9,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulsating icon
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const handleResponse = async (actionType) => {
        dismissAlarm();
        await sendFeedback(alert.id, actionType);
        navigation.goBack();
    };

    const handleDismiss = () => {
        dismissAlarm();
        navigation.goBack();
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.surface }]}>
            <RNStatusBar barStyle="dark-content" backgroundColor={theme.headerBg} />

            {/* Header area with expressive color */}
            <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
                {/* Close button */}
                <IconButton
                    icon="close"
                    iconColor={theme.onContainer}
                    size={24}
                    onPress={handleDismiss}
                    style={styles.closeBtn}
                    mode="contained-tonal"
                />

                {/* Animated icon */}
                <Animated.View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor: theme.accent,
                            transform: [
                                { scale: Animated.multiply(iconBounce, pulseAnim) },
                            ],
                        },
                    ]}
                >
                    <Icon source={theme.icon} size={48} color={theme.onAccent} />
                </Animated.View>

                {/* Severity chip */}
                <Chip
                    style={[styles.severityChip, { backgroundColor: theme.badge }]}
                    textStyle={[styles.severityChipText, { color: theme.badgeText }]}
                    compact
                >
                    {theme.label}
                </Chip>
            </View>

            {/* Content */}
            <Animated.View
                style={[
                    styles.contentWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title */}
                    <Text
                        variant="headlineMedium"
                        style={[styles.title, { color: theme.onContainer }]}
                    >
                        {alert.title}
                    </Text>

                    {/* Info pills row */}
                    <View style={styles.pillsRow}>
                        <Surface
                            style={[styles.infoPill, { backgroundColor: theme.container }]}
                            elevation={0}
                        >
                            <Icon source="map-marker" size={18} color={theme.accent} />
                            <Text
                                variant="labelLarge"
                                style={{ color: theme.onContainer, marginLeft: 6 }}
                            >
                                {alert.location || 'All Areas'}
                            </Text>
                        </Surface>
                        <Surface
                            style={[styles.infoPill, { backgroundColor: theme.container }]}
                            elevation={0}
                        >
                            <Icon source="clock-outline" size={18} color={theme.accent} />
                            <Text
                                variant="labelLarge"
                                style={{ color: theme.onContainer, marginLeft: 6 }}
                            >
                                {alert.time}
                            </Text>
                        </Surface>
                    </View>

                    {/* Description card */}
                    <Surface style={[styles.card, { backgroundColor: theme.container }]} elevation={0}>
                        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.accent }]}>
                            Description
                        </Text>
                        <Text variant="bodyLarge" style={{ color: theme.onContainer, lineHeight: 24 }}>
                            {alert.description}
                        </Text>
                    </Surface>

                    {/* Instructions card */}
                    <Surface style={[styles.card, { backgroundColor: colors.card }]} elevation={0}>
                        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.foreground }]}>
                            Immediate Actions
                        </Text>
                        <View style={styles.instructionRow}>
                            <Icon source="shield-check" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Stay calm and assess your surroundings
                            </Text>
                        </View>
                        <View style={styles.instructionRow}>
                            <Icon source="exit-run" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Follow evacuation routes if necessary
                            </Text>
                        </View>
                        <View style={styles.instructionRow}>
                            <Icon source="phone-in-talk" size={20} color={colors.primary} />
                            <Text variant="bodyMedium" style={styles.instructionText}>
                                Keep emergency contacts ready
                            </Text>
                        </View>
                    </Surface>
                </ScrollView>
            </Animated.View>

            {/* Action buttons */}
            <Animated.View
                style={[
                    styles.actionBar,
                    {
                        transform: [{ translateY: buttonsAnim }],
                        opacity: fadeAnim,
                    },
                ]}
            >
                <Button
                    mode="contained"
                    icon="check-circle"
                    onPress={() => handleResponse('SAFE')}
                    buttonColor="#006D3A"
                    textColor="#FFFFFF"
                    contentStyle={styles.primaryBtnContent}
                    labelStyle={styles.primaryBtnLabel}
                    style={styles.primaryBtn}
                >
                    I'm Safe
                </Button>
                <View style={styles.secondaryRow}>
                    <Button
                        mode="outlined"
                        icon="hospital-box"
                        onPress={() => handleResponse('MEDICAL')}
                        textColor="#BA1A1A"
                        style={[styles.secondaryBtn, { borderColor: '#BA1A1A' }]}
                        labelStyle={styles.secondaryBtnLabel}
                    >
                        Medical
                    </Button>
                    <Button
                        mode="outlined"
                        icon="fire"
                        onPress={() => handleResponse('FIRE')}
                        textColor="#C4441C"
                        style={[styles.secondaryBtn, { borderColor: '#C4441C' }]}
                        labelStyle={styles.secondaryBtnLabel}
                    >
                        Fire
                    </Button>
                    <Button
                        mode="outlined"
                        icon="hand-wave"
                        onPress={() => handleResponse('HELP')}
                        textColor={colors.primary}
                        style={[styles.secondaryBtn, { borderColor: colors.primary }]}
                        labelStyle={styles.secondaryBtnLabel}
                    >
                        Help
                    </Button>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: (RNStatusBar.currentHeight || 44) + 8,
        paddingBottom: 28,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    closeBtn: {
        position: 'absolute',
        top: (RNStatusBar.currentHeight || 44) + 4,
        right: 8,
        zIndex: 10,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        elevation: 6,
    },
    severityChip: {
        borderRadius: 20,
    },
    severityChipText: {
        fontWeight: '800',
        letterSpacing: 2,
        fontSize: 12,
    },
    contentWrapper: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 16,
    },
    title: {
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    pillsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    infoPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: '700',
        marginBottom: 8,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    instructionText: {
        color: colors.mutedForeground,
        flex: 1,
        lineHeight: 22,
    },
    actionBar: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 32,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    primaryBtn: {
        borderRadius: 20,
        marginBottom: 10,
    },
    primaryBtnContent: {
        paddingVertical: 8,
    },
    primaryBtnLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: 8,
    },
    secondaryBtn: {
        flex: 1,
        borderRadius: 16,
    },
    secondaryBtnLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
});
