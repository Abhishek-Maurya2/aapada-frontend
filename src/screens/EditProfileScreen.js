import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Icon, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../theme/colors';
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';

export default function EditProfileScreen({ navigation }) {
    const { t } = useTranslation();
    const { user, updateProfile, loading } = useStore();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);

    const getInitials = (n) => {
        if (!n) return '?';
        return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'We need access to your photo library to set a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
            setProfilePhoto(base64Uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Validation', 'Name cannot be empty.');
            return;
        }
        const success = await updateProfile(name.trim(), email.trim(), phone.trim(), profilePhoto);
        if (success) {
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon source="arrow-left" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.editProfile', 'Edit Profile')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                            <View style={styles.avatarWrapper}>
                                {profilePhoto ? (
                                    <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
                                ) : (
                                    <Avatar.Text
                                        size={110}
                                        label={getInitials(name)}
                                        style={{ backgroundColor: colors.accent }}
                                        labelStyle={{ color: colors.primary, fontWeight: '800' }}
                                    />
                                )}
                                <View style={styles.cameraIcon}>
                                    <Icon source="camera" size={18} color={colors.primaryForeground} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>{t('profile.changePhoto', 'Tap to change photo')}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('common.name', 'Name')}</Text>
                            <View style={styles.inputContainer}>
                                <Icon source="account" size={18} color={colors.mutedForeground} />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.mutedForeground}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('common.email', 'Email')}</Text>
                            <View style={styles.inputContainer}>
                                <Icon source="email" size={18} color={colors.mutedForeground} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('common.phone', 'Phone')}</Text>
                            <View style={styles.inputContainer}>
                                <Icon source="phone" size={18} color={colors.mutedForeground} />
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.primaryForeground} />
                        ) : (
                            <>
                                <Icon source="content-save" size={18} color={colors.primaryForeground} />
                                <Text style={styles.saveBtnText}>{t('common.save', 'Save Changes')}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.l, paddingVertical: spacing.l },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground, flex: 1 },
    avatarSection: { marginTop: spacing.l, alignItems: 'center', gap: 10 },
    avatarWrapper: { position: 'relative' },
    avatarImage: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.accent },
    cameraIcon: {
        position: 'absolute', bottom: 0, right: 0,
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: colors.background,
    },
    changePhotoText: { fontSize: 13, color: colors.mutedForeground },
    formSection: { marginTop: 28, gap: 20 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground, marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: colors.card, borderRadius: borderRadius.sm,
        paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 1, borderColor: colors.border,
    },
    input: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.foreground },
    saveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginTop: 36, backgroundColor: colors.primary, borderRadius: borderRadius.full,
        paddingVertical: 16,
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: colors.primaryForeground },
});
