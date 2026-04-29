import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

type Props = { code: string; compact?: boolean }

export function PlateBadge({ code, compact }: Props) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: compact ? 1.25 : 1.85,
        py: compact ? 0.8 : 1.1,
        borderRadius: 2,
        minWidth: compact ? 64 : 86,
        position: 'relative',
        bgcolor: '#f1f5f9',
        color: '#0b1228',
        backgroundImage: `
          linear-gradient(165deg, #fefefe 0%, #dce4ef 52%, #b8c9df 100%)
        `,
        border: `1px solid ${alpha('#fff', 0.65)}`,
        boxShadow:
          `inset 0 1px 0 ${alpha('#fff', 0.85)}, ` +
          `inset 0 -1px 0 ${alpha('#0f172a', 0.12)}, ` +
          '0 6px 22px rgba(2,12,35,0.35)',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontWeight: 800,
          letterSpacing: compact ? 0.06 : 0.09,
          fontSize: compact ? 17 : 21,
          lineHeight: 1,
          textShadow: `0 1px 0 ${alpha('#fff', 0.6)}`,
        }}
      >
        {code}
      </Typography>
    </Box>
  )
}
