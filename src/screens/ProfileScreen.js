import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Avatar, Text, Button, List, Switch, Divider, Surface, Icon, useTheme,
} from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Button
                    icon="arrow-left"
                    mode="text"
                    onPress={() => navigation.goBack()}
                    textColor={colors.primary}
                >
                    Back
                </Button>
                <Text variant="titleMedium" style={{ fontWeight: '700', color: colors.onSurface }}>
                    Profile
                </Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Card */}
                <Surface style={styles.profileCard} elevation={0}>
                    <Avatar.Text
                        size={96}
                        label={getInitials(user?.name)}
                        style={{ backgroundColor: colors.primaryContainer }}
                        labelStyle={{ color: colors.onPrimaryContainer, fontWeight: '700' }}
                    />
                    <Text variant="headlineMedium" style={styles.userName}>
                        {user?.name || 'User'}
                    </Text>
                    <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
                        {user?.email || 'user@example.com'}
                    </Text>
                </Surface>

                {/* Account Info */}
                <Surface style={styles.section} elevation={0}>
                    <List.Section>
                        <List.Subheader style={styles.subheader}>
                            Account Information
                        </List.Subheader>
                        <List.Item
                            title="Device ID"
                            titleStyle={{ color: colors.onSurface }}
                            description={user?.id || 'Not registered'}
                            descriptionStyle={{ color: colors.onSurfaceVariant }}
                            left={props => <List.Icon {...props} icon="cellphone" color={colors.primary} />}
                        />
                        <Divider style={{ backgroundColor: colors.outlineVariant }} />
                        <List.Item
                            title="Status"
                            titleStyle={{ color: colors.onSurface }}
                            description="Active"
                            descriptionStyle={{ color: colors.success }}
                            left={props => <List.Icon {...props} icon="check-circle" color={colors.success} />}
                            right={() => <View style={styles.statusDot} />}
                        />
                    </List.Section>
                </Surface>

                {/* Settings */}
                <Surface style={styles.section} elevation={0}>
                    <List.Section>
                        <List.Subheader style={styles.subheader}>Settings</List.Subheader>
                        <List.Item
                            title="Notifications"
                            titleStyle={{ color: colors.onSurface }}
                            description="Receive disaster alerts"
                            descriptionStyle={{ color: colors.onSurfaceVariant }}
                            left={props => <List.Icon {...props} icon="bell-outline" color={colors.primary} />}
                            right={() => (
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    color={colors.primary}
                                />
                            )}
                        />
                    </List.Section>
                </Surface>

                {/* Logout */}
                <View style={styles.actions}>
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        textColor={colors.error}
                        icon="logout"
                        style={styles.logoutButton}
                        contentStyle={{ paddingVertical: 4 }}
                    >
                        Logout
                    </Button>
                </View>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.m,
    },
    content: {
        padding: spacing.l,
    },
    profileCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 28,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    userName: {
        fontWeight: '800',
        color: colors.onSurface,
        marginTop: spacing.m,
        marginBottom: 4,
    },
    section: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 20,
        marginBottom: spacing.m,
        overflow: 'hidden',
    },
    subheader: {
        color: colors.primary,
        fontWeight: '700',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.success,
        alignSelf: 'center',
        marginRight: spacing.m,
    },
    actions: {
        marginTop: spacing.m,
    },
    logoutButton: {
        borderRadius: 20,
        borderColor: colors.error,
    },
});
