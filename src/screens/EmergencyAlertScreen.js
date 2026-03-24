import React, { useEffect, useRef, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';
import { getPrecautionsForAlert } from '../data/alertPrecautions';

const { width, height } = Dimensions.get('window');

// M3 Expressive color tokens per severity
const FLAG_COLORS = {
    RED: '#BA1A1A',
    ORANGE: '#C4441C',
    YELLOW: '#795900',
    GREEN: '#006D3A'
};

const FLAG_LIGHT_COLORS = {
    RED: '#FFDAD6',
    ORANGE: '#FFDBCF',
    YELLOW: '#FFDEA9',
    GREEN: '#C4EECD'
};

const ILLUSTRATIONS = {
    earthquake_drop: require('../../assets/illustrations/earthquake_drop.png'),
    flood_high_ground: require('../../assets/illustrations/flood_high_ground.png'),
    fire_crawl: require('../../assets/illustrations/fire_crawl.png'),
    cyclone_indoor: require('../../assets/illustrations/cyclone_indoor.png'),
    tsunami_run: require('../../assets/illustrations/tsunami_run.png'),
};

const getSeverityTheme = (severity, flag) => {
    if (flag && FLAG_COLORS[flag]) {
        return {
            container: FLAG_LIGHT_COLORS[flag],
            onContainer: '#261A00',
            accent: FLAG_COLORS[flag],
            onAccent: '#FFFFFF',
            surface: '#FFFBFF',
            badge: FLAG_COLORS[flag],
            badgeText: '#FFFFFF',
            icon: 'alert-decagram',
            label: flag,
        };
    }

    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return {
                container: '#FFDAD6',
                onContainer: '#410002',
                accent: '#BA1A1A',
                onAccent: '#FFFFFF',
                surface: '#FFF8F7',
                badge: '#BA1A1A',
                badgeText: '#FFFFFF',
                icon: 'alert-octagon',
                label: 'CRITICAL',
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
            };
    }
};

export default function EmergencyAlertScreen({ route, navigation }) {
    const { alert } = route.params;
    const { t } = useTranslation();
    const { sendFeedback, dismissAlarm } = useStore();
    const theme = getSeverityTheme(alert.severity, alert.flag);
    const alertData = getPrecautionsForAlert(alert);

    // Hiding status bar for full-screen takeover
    useFocusEffect(
        useCallback(() => {
            StatusBar.setHidden(true, 'fade');
            return () => StatusBar.setHidden(false, 'fade');
        }, [])
    );

    const getDisplayLocation = () => {
        const loc = alert.location || alert.targetRegion;
        if (!loc) return t('home.allAreas');
        if (typeof loc === 'string') return loc;
        if (typeof loc === 'object' && loc.type === 'Point') {
            return `Radius of (${loc.radius}m)`;
        }
        return t('home.allAreas');
    };

    const flatListRef = useRef(null);
    const [activeIntervalIndex, setActiveIntervalIndex] = React.useState(0);

    useEffect(() => {
        if (alertData.precautions.length <= 1) return;
        
        const interval = setInterval(() => {
            const nextIndex = (activeIntervalIndex + 1) % alertData.precautions.length;
            flatListRef.current?.scrollToIndex({ 
                index: nextIndex, 
                animated: true 
            });
            setActiveIntervalIndex(nextIndex);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [activeIntervalIndex, alertData.precautions.length]);

    const renderProtocolItem = ({ item, index }) => (
        <View style={styles.carouselItem}>
            <Image 
                source={ILLUSTRATIONS[item.graphic] || ILLUSTRATIONS.cyclone_indoor} 
                style={styles.illustration}
                resizeMode="contain"
            />
            <View style={styles.protocolTextContainer}>
                <View style={[styles.indexDot, { backgroundColor: theme.container, marginBottom: 8 }]}>
                    <Text style={{ color: theme.accent, fontWeight: '900', fontSize: 12 }}>{index + 1}</Text>
                </View>
                <Text variant="titleMedium" style={styles.instructionTextMain}>
                    {t(item.text)}
                </Text>
            </View>
        </View>
    );

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(60)).current;
    const iconBounce = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const buttonsAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.stagger(120, [
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(iconBounce, {
                toValue: 1,
                tension: 80,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.spring(buttonsAnim, {
                toValue: 0,
                tension: 40,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
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
        <View style={[styles.root, { backgroundColor: theme.accent }]}>
            {/* Immersive Header Backdrop */}
            <View style={styles.immersiveBackdrop}>
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            transform: [{ scale: pulseAnim }],
                            borderColor: 'rgba(255,255,255,0.2)'
                        }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.iconCircle,
                        {
                            transform: [{ scale: iconBounce }],
                        },
                    ]}
                >
                    <Icon source={alertData.icon || theme.icon} size={84} color="#FFFFFF" />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim }}>
                    <Chip
                        style={[styles.severityChip, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                        textStyle={styles.severityChipText}
                    >
                        {t(`severity.${theme.label.toLowerCase()}`, { defaultValue: theme.label })}
                    </Chip>
                </Animated.View>
            </View>

            {/* Floating Action Button (Close) */}
            {/* <TouchableOpacity style={styles.closeOverlay} onPress={handleDismiss}>
                <Icon source="close" size={28} color="#FFFFFF" />
            </TouchableOpacity> */}

            {/* Content Bottom Sheet */}
            <Animated.View
                style={[
                    styles.contentSheet,
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
                    <Text variant="headlineMedium" style={[styles.title, { color: '#000' }]}>
                        {alert.title}
                    </Text>

                    <View style={styles.metaRow}>
                        <Surface style={[styles.metaPill, { backgroundColor: theme.container }]} elevation={0}>
                            <Icon source="map-marker" size={16} color={theme.accent} />
                            <Text variant="labelLarge" style={{ color: theme.onContainer, marginLeft: 6 }}>
                                {getDisplayLocation()}
                            </Text>
                        </Surface>
                        <Surface style={[styles.metaPill, { backgroundColor: theme.container }]} elevation={0}>
                            <Icon source="clock-outline" size={16} color={theme.accent} />
                            <Text variant="labelLarge" style={{ color: theme.onContainer, marginLeft: 6 }}>
                                {alert.time}
                            </Text>
                        </Surface>
                    </View>

                    <Surface style={styles.descriptionCard} elevation={0}>
                        <Text variant="titleSmall" style={{ color: theme.accent, fontWeight: '800', marginBottom: 6 }}>
                            {t('emergency.incidentUpdate')}
                        </Text>
                        <Text variant="bodyLarge" style={{ color: '#334155', lineHeight: 24 }}>
                            {alert.description}
                        </Text>
                    </Surface>

                    <Text style={styles.sectionTitle}>{t('emergency.protocols')}</Text>
                    
                    <View style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={alertData.precautions}
                            renderItem={renderProtocolItem}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const newIndex = Math.round(e.nativeEvent.contentOffset.x / (width - 48));
                                setActiveIntervalIndex(newIndex);
                            }}
                            snapToInterval={width - 48}
                            decelerationRate="fast"
                        />
                        
                        <View style={styles.pagination}>
                            {alertData.precautions.map((_, i) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.dot, 
                                        { backgroundColor: i === activeIntervalIndex ? theme.accent : '#CBD5E1' }
                                    ]} 
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>

            {/* Response Bar */}
            <Animated.View
                style={[
                    styles.responseBar,
                    {
                        transform: [{ translateY: buttonsAnim }],
                        opacity: fadeAnim,
                    },
                ]}
            >
                <TouchableOpacity
                    style={[styles.primarySafeBtn, { backgroundColor: '#006D3A' }]}
                    onPress={() => handleResponse('SAFE')}
                >
                    <Text style={styles.primarySafeText}>{t('emergency.imSafeLong')}</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={[styles.smallActionBtn, { borderColor: '#BA1A1A' }]}
                        onPress={() => handleResponse('MEDICAL')}
                    >
                        <Icon source="hospital-box" size={20} color="#BA1A1A" />
                        <Text style={[styles.smallActionText, { color: '#BA1A1A' }]}>{t('emergency.medical')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.smallActionBtn, { borderColor: colors.primary }]}
                        onPress={() => handleResponse('HELP')}
                    >
                        <Icon source="hand-wave" size={20} color={colors.primary} />
                        <Text style={[styles.smallActionText, { color: colors.primary }]}>{t('emergency.sosHelp')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    immersiveBackdrop: {
        height: height * 0.45,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    pulseRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
    },
    iconCircle: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    severityChip: {
        borderRadius: 8,
        paddingHorizontal: 4,
    },
    severityChipText: {
        fontWeight: '900',
        letterSpacing: 2,
        fontSize: 11,
        color: '#FFFFFF',
    },
    closeOverlay: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentSheet: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        marginTop: -40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 24,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 140,
    },
    title: {
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 32,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 15,
        justifyContent: 'center',
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 52,
    },
    descriptionCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
        padding: 20,
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    indexDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionTextMain: {
        color: '#1E293B',
        lineHeight: 26,
        fontWeight: '800',
        textAlign: 'center',
    },
    carouselContainer: {
        marginBottom: 20,
    },
    carouselItem: {
        width: width - 48,
        alignItems: 'center',
        paddingVertical: 10,
    },
    illustration: {
        width: width * 0.6,
        height: 180,
        marginBottom: 20,
    },
    protocolTextContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 15,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    responseBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    primarySafeBtn: {
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#006D3A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    primarySafeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 8,
    },
    smallActionBtn: {
        flex: 1,
        height: 50,
        borderRadius: 56,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    smallActionText: {
        fontSize: 14,
        fontWeight: '900',
    },
});

