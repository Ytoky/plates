import { Box, Typography } from '@mui/material'

type Props = { code: string; compact?: boolean }

export function PlateBadge({ code, compact }: Props) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: compact ? 1.25 : 1.75,
        py: compact ? 0.75 : 1,
        borderRadius: 2,
        bgcolor: '#f3f4f6',
        color: '#0b1220',
        border: '1px solid rgba(15,23,42,0.18)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        minWidth: compact ? 64 : 84,
      }}
    >
      <Typography
        sx={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontWeight: 800,
          letterSpacing: 1,
          fontSize: compact ? 18 : 22,
          lineHeight: 1,
        }}
      >
        {code}
      </Typography>
    </Box>
  )
}
