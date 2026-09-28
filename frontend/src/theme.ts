import { createTheme } from '@mui/material/styles'

// ── Snail Racing – Global MUI Theme ────────────────────────────────────────
// Palette: deep navy-blue primary, slate accents. Professional and clean.
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            // Deep teal-blue
            main: '#1565C0',
            light: '#2979D0',
            dark: '#0D47A1',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // Warm slate accent
            main: '#37474F',
            light: '#546E7A',
            dark: '#263238',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F0F4FA',   // Very light blue-grey
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0D1B2A',
            secondary: '#4A6080',
        },
        success: {
            main: '#1B6B3A',
        },
        error: {
            main: '#C0392B',
        },
        divider: '#D0DCF0',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        // ── Card ───────────────────────────────────────────────────────────
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 12px rgba(15, 40, 90, 0.08)',
                    borderRadius: 16,
                    border: '1px solid #D8E4F4',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(15, 40, 90, 0.13)',
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    '&:last-child': {
                        paddingBottom: '24px',
                    },
                },
            },
        },
        // ── Button ─────────────────────────────────────────────────────────
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(21, 101, 192, 0.28)',
                    },
                },
            },
            // Gradient on the primary contained variant
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
                        },
                        '&:disabled': {
                            background: '#90A9D0',
                            color: '#FFFFFF',
                        },
                    },
                },
            ],
        },
        // ── TextField ──────────────────────────────────────────────────────
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: '#F6F9FF',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1565C0',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1565C0',
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1565C0',
                    },
                },
            },
        },
        // ── Paper ──────────────────────────────────────────────────────────
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        // ── Drawer ─────────────────────────────────────────────────────────
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(180deg, #0D2A5E 0%, #133580 100%)',
                    color: '#FFFFFF',
                    borderRight: 'none',
                },
            },
        },
        // ── List items inside Drawer ────────────────────────────────────────
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: '2px 8px',
                    padding: '10px 16px',
                    color: '#A8C4E8',
                    transition: 'all 0.15s ease',
                    '& .MuiListItemIcon-root': {
                        color: '#7AAAD4',
                        minWidth: 40,
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                        '& .MuiListItemIcon-root': {
                            color: '#FFFFFF',
                        },
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        '& .MuiListItemIcon-root': {
                            color: '#FFFFFF',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                    },
                },
            },
        },
        // ── Divider inside Drawer ──────────────────────────────────────────
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255,255,255,0.12)',
                },
            },
        },
        // ── AppBar for mobile nav ──────────────────────────────────────────
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, #0D2A5E 0%, #133580 100%)',
                    boxShadow: '0 2px 8px rgba(13,42,94,0.35)',
                },
            },
        },
        // ── Alert ──────────────────────────────────────────────────────────
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        // ── Chip ───────────────────────────────────────────────────────────
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
    },
})

export default theme
