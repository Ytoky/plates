import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import { Card, CardActionArea, Chip, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { RegionDef } from '../data/regions'
import type { RegionEntry } from '../model/collection'
import { PlateBadge } from './PlateBadge'

type Props = {
  region: RegionDef
  entry: RegionEntry | undefined
  onOpen: () => void
}

export function RegionCard({ region, entry, onOpen }: Props) {
  const theme = useTheme()
  const collected = Boolean(entry?.collected)
  const hasPhoto = Boolean(entry?.photo)

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        bgcolor: collected ? alpha(theme.palette.primary.main, 0.06) : alpha('#fff', 0.02),
        borderColor: collected ? alpha(theme.palette.primary.main, 0.42) : alpha('#fff', 0.068),
        boxShadow: collected
          ? `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.12)}`
          : undefined,
        '&:active': {
          transform: 'scale(0.985)',
        },
        transition: 'transform 0.15s ease, box-shadow 0.22s ease, border-color 0.2s ease',
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: alpha(theme.palette.primary.main, collected ? 0.62 : 0.28),
            boxShadow: `0 18px 40px ${alpha(theme.palette.primary.main, 0.09)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.16)} inset`,
          },
        },
      }}
    >
      <CardActionArea
        onClick={onOpen}
        sx={{
          height: '100%',
          alignItems: 'stretch',
          p: 2,
          '&:focus-visible': {
            outlineOffset: -2,
          },
        }}
      >
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <PlateBadge code={region.code} compact />
            {collected ? (
              <CheckCircleRoundedIcon color="primary" fontSize="small" sx={{ opacity: 0.95 }} />
            ) : (
              <RadioButtonUncheckedRoundedIcon
                color="disabled"
                fontSize="small"
                sx={{ opacity: 0.5 }}
              />
            )}
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minHeight: 44, fontWeight: 500 }}
          >
            {region.name}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.75 }}>
            {hasPhoto ? (
              <Chip
                size="small"
                icon={<ImageRoundedIcon sx={{ '&&': { fontSize: 17 } }} />}
                label="Есть фото"
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.12),
                  borderColor: 'transparent',
                }}
              />
            ) : null}
            <Chip
              size="small"
              variant={collected ? 'filled' : 'outlined'}
              color={collected ? 'primary' : 'default'}
              label={collected ? 'Собрано' : 'Пусто'}
              sx={{
                ...(collected
                  ? { fontWeight: 700 }
                  : {
                      borderStyle: 'dashed',
                      borderColor: alpha(theme.palette.primary.main, 0.35),
                      opacity: 0.92,
                    }),
              }}
            />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  )
}
