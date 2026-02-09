import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
    fontFamily: 'MaterialCommunityIcons', // Just in case, but usually system default
};

export const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: colors.primary,
        onPrimary: '#FFFFFF',
        primaryContainer: colors.surfaceHighlight,
        onPrimaryContainer: colors.text,
        secondary: colors.secondary,
        onSecondary: '#FFFFFF',
        secondaryContainer: colors.surfaceHighlight,
        onSecondaryContainer: colors.textSecondary,
        tertiary: colors.accent,
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#F43F5E33',
        onTertiaryContainer: colors.accent,
        background: colors.background,
        onBackground: colors.text,
        surface: colors.surface,
        onSurface: colors.text,
        surfaceVariant: colors.surfaceHighlight,
        onSurfaceVariant: colors.textSecondary,
        outline: colors.border,
        error: colors.error,
        onError: '#FFFFFF',
        elevation: {
            level0: 'transparent',
            level1: colors.surface,
            level2: colors.surfaceHighlight,
            level3: colors.surface,
            level4: colors.surfaceHighlight,
            level5: colors.surface,
        },
    },
    // roundness: 2, // Minimal roundness for a clean, pro look
};
