import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, List, Switch, Divider, Surface, useTheme } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import useStore from '../store/useStore';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const theme = useTheme();

    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Button
                    icon="arrow-left"
                    mode="text"
                    onPress={() => navigation.goBack()}
                    textColor={theme.colors.primary}
                >
                    Back
                </Button>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Profile</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileHeader}>
                    <Avatar.Text
                        size={100}
                        label={getInitials(user?.name)}
                        style={{ backgroundColor: theme.colors.primary, marginBottom: spacing.m }}
                    />
                    <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>{user?.name || 'User'}</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>{user?.email || 'user@example.com'}</Text>
                </View>

                <Surface style={[styles.infoSection, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <List.Section>
                        <List.Subheader>Account Information</List.Subheader>
                        <List.Item
                            title="Device ID"
                            description={user?.id || 'Not registered'}
                            left={props => <List.Icon {...props} icon="cellphone" />}
                        />
                        <Divider />
                        <List.Item
                            title="Status"
                            description="Active"
                            left={props => <List.Icon {...props} icon="check-circle" color={colors.success} />}
                            right={() => <View style={styles.statusDot} />}
                        />
                    </List.Section>
                </Surface>

                <Surface style={[styles.infoSection, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <List.Section>
                        <List.Subheader>Settings</List.Subheader>
                        <List.Item
                            title="Notifications"
                            description="Receive disaster alerts"
                            left={props => <List.Icon {...props} icon="bell" />}
                            right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
                        />
                    </List.Section>
                </Surface>

                <View style={styles.actions}>
                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        buttonColor={colors.error}
                        icon="logout"
                        style={styles.logoutButton}
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    infoSection: {
        borderRadius: 12,
        marginBottom: spacing.l,
        overflow: 'hidden',
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
        marginTop: spacing.l,
    },
    logoutButton: {
        borderRadius: 8,
        paddingVertical: 4,
    },
});

