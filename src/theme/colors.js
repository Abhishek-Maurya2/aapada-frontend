export const colors = {
    background: '#0F172A', // Slate 900
    surface: '#1E293B',    // Slate 800
    surfaceHighlight: '#334155', // Slate 700
    primary: '#3B82F6',    // Blue 500
    secondary: '#6366F1',  // Indigo 500
    accent: '#F43F5E',     // Rose 500 (Alerts)
    success: '#10B981',    // Emerald 500
    text: '#F8FAFC',       // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    border: '#334155',
    error: '#EF4444',
    overlay: 'rgba(15, 23, 42, 0.8)',
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
    h1: { fontSize: 32, fontWeight: '700', color: colors.text },
    h2: { fontSize: 24, fontWeight: '700', color: colors.text },
    h3: { fontSize: 20, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, color: colors.textSecondary },
    caption: { fontSize: 14, color: colors.textSecondary },
    button: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
};
