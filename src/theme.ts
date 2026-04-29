import { alpha, createTheme } from '@mui/material/styles'

const bgDeep = '#060a12'
const bgElevated = '#0f1624'
const bgSurface = '#151d32'
const accentCyan = '#6ecff7'
const accentViolet = '#b8a9f0'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    divider: alpha('#94a8c8', 0.14),
    primary: {
      main: accentCyan,
      light: '#9fddfc',
      dark: '#42a5c9',
    },
    secondary: {
      main: accentViolet,
      light: '#d4cbf8',
      dark: '#8b7fcf',
    },
    text: {
      primary: '#e9eef8',
      secondary: alpha('#c8d4ec', 0.78),
      disabled: alpha('#94a8c8', 0.45),
    },
    background: {
      default: bgDeep,
      paper: bgSurface,
    },
    action: {
      hover: alpha('#fff', 0.06),
      selected: alpha(accentCyan, 0.14),
      focus: alpha(accentCyan, 0.22),
      disabledOpacity: 0.4,
    },
  },
  typography: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontWeightRegular: 500,
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 },
    h6: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
    subtitle1: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle2: { fontWeight: 600 },
    body2: { lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 650, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: bgDeep,
          backgroundImage: [
            `radial-gradient(ellipse 900px 440px at 12% -6%, ${alpha(accentCyan, 0.22)}, transparent 55%)`,
            `radial-gradient(ellipse 760px 480px at 88% -4%, ${alpha(accentViolet, 0.18)}, transparent 50%)`,
            `radial-gradient(ellipse 140% 60% at 50% 100%, ${alpha('#0c1828', 0.92)}, transparent 70%)`,
            `linear-gradient(180deg, ${bgDeep} 0%, ${alpha(bgElevated, 0.4)} 42%, ${bgDeep} 100%)`,
          ].join(', '),
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(165deg, ${alpha('#fff', 0.045)}, ${alpha('#fff', 0)})`,
          border: `1px solid ${alpha('#fff', 0.055)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha(accentCyan, 0.1)}`,
          backgroundColor: alpha(bgDeep, 0.72),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: `linear-gradient(160deg, ${alpha(bgSurface, 1)} 0%, ${alpha(bgElevated, 0.98)} 100%)`,
          border: `1px solid ${alpha(accentCyan, 0.12)}`,
          boxShadow: `0 24px 64px rgba(0, 0, 0, 0.45), 0 0 0 1px ${alpha('#fff', 0.03)} inset`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: alpha('#000', 0.22),
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(accentCyan, 0.35),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderColor: alpha(accentCyan, 0.55),
          },
        },
        notchedOutline: {
          borderColor: alpha('#fff', 0.1),
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: accentCyan,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 650,
          borderRadius: 10,
        },
        outlined: {
          borderColor: alpha('#fff', 0.14),
          backgroundColor: alpha('#000', 0.18),
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha('#fff', 0.072),
          overflow: 'hidden',
        },
        barColorPrimary: {
          backgroundImage: `linear-gradient(90deg, ${accentCyan}, ${accentViolet})`,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          px: 1.75,
          borderColor: alpha('#fff', 0.14),
          '&.Mui-selected': {
            color: alpha('#081018', 0.94),
            backgroundImage: `linear-gradient(145deg, ${accentCyan}, ${alpha(accentViolet, 0.95)})`,
          },
          '&.Mui-selected:hover': {
            backgroundImage: `linear-gradient(145deg, ${accentCyan}, ${accentViolet})`,
            opacity: 0.94,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.18s ease, background-color 0.18s ease',
          '&:hover': {
            transform: 'scale(1.04)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'transform 0.16s ease, box-shadow 0.2s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundImage: `linear-gradient(135deg, ${alpha(accentCyan, 0.95)}, ${alpha('#5ab0d9', 0.98)})`,
            '&:hover': {
              backgroundImage: `linear-gradient(135deg, ${accentCyan}, ${alpha(accentViolet, 0.85)})`,
              boxShadow: `0 8px 24px ${alpha(accentCyan, 0.28)}`,
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: alpha(accentCyan, 0.4),
            '&:hover': {
              borderColor: alpha(accentCyan, 0.62),
              backgroundColor: alpha(accentCyan, 0.08),
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
          border: `1px solid ${alpha('#fff', 0.068)}`,
        },
      },
    },
  },
})
