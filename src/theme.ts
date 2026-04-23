import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7dd3fc' },
    secondary: { main: '#c4b5fd' },
    background: {
      default: '#0b1220',
      paper: '#111b2e',
    },
  },
  typography: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(1200px 600px at 20% -10%, rgba(125,211,252,0.18), transparent), radial-gradient(900px 500px at 100% 0%, rgba(196,181,253,0.14), transparent)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
        },
      },
    },
  },
})
