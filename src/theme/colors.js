// Purple HSL-270 Design System (matching reference repo)
// Converted from HSL to hex for React Native compatibility

export const colors = {
    // Core
    background: '#FDFAFF',       // hsl(270,100%,98%)
    foreground: '#1A1625',       // hsl(270,20%,10%)
    card: '#F3EDF7',             // hsl(270,40%,96%)
    cardForeground: '#1A1625',   // hsl(270,20%,10%)

    // Primary
    primary: '#7C3AED',          // hsl(270,60%,50%)
    primaryForeground: '#FFFFFF',
    onPrimary: '#FFFFFF',

    // Secondary
    secondary: '#E4D4F4',        // hsl(270,40%,90%)
    secondaryForeground: '#4C1D95', // hsl(270,60%,30%)

    // Muted
    muted: '#EDE8F2',            // hsl(270,20%,94%)
    mutedForeground: '#6B6B78',  // hsl(270,10%,45%)

    // Accent
    accent: '#D4B5FF',           // hsl(270,50%,85%)
    accentForeground: '#3B0764', // hsl(270,60%,25%)

    // Destructive / Error
    destructive: '#E53E3E',      // hsl(0,80%,55%)
    error: '#E53E3E',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#7F1D1D',

    // Border / Input
    border: '#DDD6E5',           // hsl(270,20%,88%)
    input: '#DDD6E5',

    // Ring
    ring: '#7C3AED',

    // Semantic
    success: '#22C55E',          // hsl(145,60%,40%)
    successContainer: '#DCFCE7',
    warning: '#F59E0B',          // hsl(35,95%,50%)
    warningContainer: '#FEF3C7',

    // Surface aliases (for compatibility)
    surface: '#FDFAFF',
    onSurface: '#1A1625',
    surfaceVariant: '#F3EDF7',
    onSurfaceVariant: '#6B6B78',
    surfaceContainerLow: '#F3EDF7',
    surfaceContainer: '#EDE8F2',
    surfaceContainerHigh: '#E4D4F4',
    surfaceContainerHighest: '#DDD6E5',

    // Outline
    outline: '#9CA3AF',
    outlineVariant: '#DDD6E5',

    // Inverse
    inverseSurface: '#1A1625',
    inverseOnSurface: '#F3EDF7',
    inversePrimary: '#D4B5FF',

    // Containers for Paper
    primaryContainer: '#E4D4F4',
    onPrimaryContainer: '#4C1D95',
    secondaryContainer: '#E4D4F4',
    onSecondaryContainer: '#4C1D95',
    tertiaryContainer: '#D4B5FF',
    onTertiaryContainer: '#3B0764',

    // Legacy aliases
    text: '#1A1625',
    textSecondary: '#6B6B78',
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    itemGap: 12,
};

export const typography = {
    h1: { fontSize: 32, fontWeight: '900', color: '#1A1625', letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '900', color: '#1A1625', letterSpacing: -0.5 },
    h3: { fontSize: 20, fontWeight: '700', color: '#1A1625' },
    body: { fontSize: 16, color: '#6B6B78' },
    caption: { fontSize: 14, color: '#6B6B78' },
    button: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
};

export const borderRadius = {
    sm: 12,
    md: 16,
    lg: 24,    // rounded-3xl equivalent
    full: 9999,
};
