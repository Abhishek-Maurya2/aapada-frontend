import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Icon, Snackbar } from "react-native-paper";
import { colors, spacing, borderRadius } from "../theme/colors";
import useStore from "../store/useStore";
import { useTranslation } from "react-i18next";
import { getPrecautionsForType } from "../data/alertPrecautions";

const FLAG_COLORS = {
  RED: "#EF4444",
  ORANGE: "#F97316",
  YELLOW: "#EAB308",
  GREEN: "#22C55E",
};

const getAlertColor = (alert) => {
  if (alert.flag && FLAG_COLORS[alert.flag]) return FLAG_COLORS[alert.flag];
  switch (alert.severity?.toUpperCase()) {
    case "CRITICAL":
      return "#dc2626";
    case "HIGH":
      return "#3b82f6";
    case "MEDIUM":
      return "#f59e0b";
    default:
      return "#22c55e";
  }
};

const getAlertIcon = (alert) => {
  const disasterData = getPrecautionsForType(alert.alertType);
  if (disasterData && disasterData.icon) return disasterData.icon;

  switch (alert.severity?.toUpperCase()) {
    case "CRITICAL":
      return "flash-alert";
    case "HIGH":
      return "waves";
    case "MEDIUM":
      return "weather-windy";
    default:
      return "fire";
  }
};

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { alerts, loading, fetchAlerts, user, sendFeedback, dismissAlarm } =
    useStore();
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [activeSafetyIndex, setActiveSafetyIndex] = useState(0);
  const { width } = useWindowDimensions();
  const normalStateIllustration = require("../../assets/banner.png");
  const carouselCardWidth = width - spacing.l * 2;

  const QUICK_ACTIONS = [
    {
      icon: "alarm-light",
      label: t("home.sos"),
      bg: "#EF4444",
      iconColor: "#fff",
    },
    {
      icon: "phone",
      label: t("home.call112"),
      bg: colors.primary,
      iconColor: "#fff",
    },
    {
      icon: "map-marker-radius",
      label: t("home.safeZones"),
      bg: colors.accent,
      iconColor: colors.primary,
    },
    {
      icon: "weather-cloudy",
      label: t("home.weather"),
      bg: colors.secondary,
      iconColor: colors.secondaryForeground,
    },
  ];

  const safetySlides = useMemo(() => {
    const defaultTypes = ["Flood", "Earthquake", "Fire"];
    const activeTypes = alerts.map((alert) => alert.alertType).filter(Boolean);

    const uniqueTypes = [...new Set([...activeTypes, ...defaultTypes])].slice(
      0,
      5,
    );

    return uniqueTypes.map((type) => {
      const info = getPrecautionsForType(type);
      const precautions = info?.precautions || [];

      const dos = precautions
        .filter((item) => !/^(do not|don't)/i.test(t(item.text || item)))
        .map(item => t(item.text || item))
        .slice(0, 2);

      const donts = precautions
        .filter((item) => /^(do not|don't)/i.test(t(item.text || item)))
        .map(item => t(item.text || item))
        .slice(0, 2);

      return {
        type,
        icon: info?.icon || "alert-circle",
        color: info?.color || colors.primary,
        precaution: precautions[0]?.text
          ? t(precautions[0].text)
          : t("emergency.action1"),
        dos: dos.length
          ? dos
          : [
            t("home.checklist.kit"),
            t("home.checklist.contact"),
          ],
        donts: donts.length
          ? donts
          : [
            t("home.noAlertsDesc"),
            t("home.noActiveDisasters"),
          ],
      };
    });
  }, [alerts]);

  useEffect(() => {
    fetchAlerts();
    const pollInterval = setInterval(() => {
      fetchAlerts(true);
    }, 5000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleAlertPress = (alert) => {
    navigation.navigate("AlertDetail", { alert });
  };

  const handleAction = async (alertId, actionType) => {
    dismissAlarm();
    const success = await sendFeedback(alertId, actionType);
    if (success) {
      setFeedbackSent(actionType);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchAlerts}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appBarTitle}>{t('home.staySafe')}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => navigation.navigate("AlertHistory")}
                style={styles.iconActionBtn}
              >
                <Icon source="bell" size={22} color={colors.primary} />
                {alerts.length > 0 && <View style={styles.bellDot} />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={styles.avatarBtn}
                activeOpacity={0.8}
              >
                {user?.profilePhoto ? (
                  <Image
                    source={{ uri: user.profilePhoto }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {getInitials(user?.name)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>{t('home.everythingNormal')}</Text>
              <Text style={styles.heroSubtitle}>
                {t('home.alertsNearby')}
              </Text>
            </View>
            <Image
              source={normalStateIllustration}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* Quick Actions */}
          {/*
                    <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
                    <View style={styles.quickGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.label}
                                style={styles.quickCard}
                                activeOpacity={0.75}
                                onPress={() => {
                                    if (action.label === t('home.call112')) Linking.openURL('tel:112');
                                }}
                            >
                                <View style={[styles.quickIconBox, { backgroundColor: action.bg }]}>
                                    <Icon source={action.icon} size={22} color={action.iconColor} />
                                </View>
                                <Text style={styles.quickLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>*/}

          {/* Safety Carousel */}
          <View style={styles.safetyCarouselWrap}>
            <View style={styles.safetyHeaderRow}>
              <Text style={styles.sectionTitle}>{t('emergency.protocols')}</Text>
              {/* <Text style={styles.safetyHint}>Swipe</Text> */}
            </View>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const nextIndex = Math.round(
                  event.nativeEvent.contentOffset.x / carouselCardWidth,
                );
                setActiveSafetyIndex(nextIndex);
              }}
            >
              {safetySlides.map((slide) => (
                <View
                  key={slide.type}
                  style={[styles.safetySlide, { width: carouselCardWidth }]}
                >
                  <View style={styles.safetySlideHeader}>
                    <View
                      style={[
                        styles.safetyIconBox,
                        { backgroundColor: `${slide.color}20` },
                      ]}
                    >
                      <Icon source={slide.icon} size={20} color={slide.color} />
                    </View>
                    <Text style={styles.safetySlideTitle}>{t('disasterTypes.' + slide.type)}</Text>
                  </View>

                  <Text style={styles.safetyPrimaryText}>
                    {slide.precaution}
                  </Text>

                  <View style={styles.safetyColumns}>
                    <View style={styles.safetyColumn}>
                      <Text style={styles.safetyColumnTitle}>{t('common.do')}</Text>
                      {slide.dos.map((line, idx) => (
                        <Text
                          key={`${slide.type}-do-${idx}`}
                          style={styles.safetyListItem}
                        >
                          - {line}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.safetyColumn}>
                      <Text style={styles.safetyColumnTitle}>{t('common.dont')}</Text>
                      {slide.donts.map((line, idx) => (
                        <Text
                          key={`${slide.type}-dont-${idx}`}
                          style={styles.safetyListItem}
                        >
                          - {line}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.safetyDotsRow}>
              {safetySlides.map((slide, idx) => (
                <View
                  key={`${slide.type}-dot`}
                  style={[
                    styles.safetyDot,
                    idx === activeSafetyIndex && styles.safetyDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Recent Alerts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.recentAlerts")}</Text>
            <TouchableOpacity
              style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}
              onPress={() => navigation.navigate("AlertHistory")}
            >
              <Text style={styles.viewAllText}>{t("common.seeAll")}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 8, paddingBottom: 80 }}>
            {alerts.length > 0
              ? alerts.map((alert) => {
                const alertColor = getAlertColor(alert);
                return (
                  <TouchableOpacity
                    key={alert.id}
                    style={styles.alertCard}
                    onPress={() => handleAlertPress(alert)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.alertIconBox,
                        { backgroundColor: alertColor + "20" },
                      ]}
                    >
                      <Icon
                        source={getAlertIcon(alert)}
                        size={38}
                        color={alertColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {alert.flag && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: FLAG_COLORS[alert.flag],
                            }}
                          />
                        )}
                        <Text style={styles.alertType}>{alert.title}</Text>
                      </View>
                      <View style={styles.alertMeta}>
                        <Icon
                          source="map-marker"
                          size={12}
                          color={colors.mutedForeground}
                        />
                        <Text style={styles.alertMetaText}>
                          {alert.location || t("home.allAreas")} ·{" "}
                          {alert.time}
                        </Text>
                      </View>
                    </View>
                    <Icon
                      source="chevron-right"
                      size={28}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                );
              })
              : !loading && (
                <View style={styles.emptyState}>
                  <Icon
                    source="check-decagram"
                    size={48}
                    color={colors.success}
                  />
                  <Text style={styles.emptyTitle}>{t("home.noAlerts")}</Text>
                  <Text style={styles.emptyText}>
                    {t("home.noAlertsDesc")}
                  </Text>
                </View>
              )}
          </View>
        </View>
      </ScrollView>

      {/* Floating SOS */}
      {/* <TouchableOpacity style={styles.sosFab} activeOpacity={0.8}>
                <Icon source="alarm-light" size={28} color="#fff" />
            </TouchableOpacity> */}

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
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appBarTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.foreground,
    letterSpacing: -0.4,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    right: 5,
    top: 5,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { fontSize: 14, fontWeight: "800", color: colors.primary },
  heroCard: {
    marginTop: spacing.l,
    backgroundColor: "#FDE9B9",
    borderRadius: borderRadius.lg,
    paddingLeft: 18,
    paddingRight: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9C97A",
  },
  heroLeft: { flex: 1, paddingRight: 8 },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#262626",
    lineHeight: 24,
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 8,
    lineHeight: 16,
  },
  heroImage: { width: 132, height: 118 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    marginTop: 32,
    marginBottom: 12,
  },
  safetyCarouselWrap: { marginTop: 0 },
  safetyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  safetyHint: { fontSize: 12, color: colors.mutedForeground, marginTop: 20 },
  safetySlide: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  safetySlideHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  safetyIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  safetySlideTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.foreground,
  },
  safetyPrimaryText: {
    fontSize: 13,
    color: colors.foreground,
    marginTop: 10,
    lineHeight: 18,
  },
  safetyColumns: { flexDirection: "row", gap: 12, marginTop: 12 },
  safetyColumn: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  safetyColumnTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 6,
  },
  safetyListItem: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
    marginBottom: 4,
  },
  safetyDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  safetyDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.border,
  },
  safetyDotActive: {
    width: 18,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  quickGrid: { flexDirection: "row", gap: 12 },
  quickCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingVertical: 20,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: 12, fontWeight: "600", color: colors.foreground },
  viewAllText: { fontSize: 14, fontWeight: "600", color: colors.primary },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    marginBottom: 12,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    padding: 12,
  },
  alertIconBox: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  alertType: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  alertMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  alertMetaText: { fontSize: 12, color: colors.mutedForeground },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.foreground },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  sosFab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
