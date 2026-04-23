import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Card, CardActionArea, Chip, Stack, Typography } from '@mui/material'
import type { RegionDef } from '../data/regions'
import type { RegionEntry } from '../model/collection'
import { PlateBadge } from './PlateBadge'

type Props = {
  region: RegionDef
  entry: RegionEntry | undefined
  onOpen: () => void
}

export function RegionCard({ region, entry, onOpen }: Props) {
  const collected = Boolean(entry?.collected)
  const hasPhoto = Boolean(entry?.photo)

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: collected ? 'primary.main' : 'divider',
        boxShadow: collected ? '0 0 0 1px rgba(125,211,252,0.35) inset' : 'none',
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ height: '100%', alignItems: 'stretch', p: 2 }}>
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <PlateBadge code={region.code} compact />
            {collected ? (
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
            {region.name}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {hasPhoto ? <Chip size="small" icon={<ImageOutlinedIcon />} label="Фото" /> : null}
            <Chip
              size="small"
              variant={collected ? 'filled' : 'outlined'}
              color={collected ? 'primary' : 'default'}
              label={collected ? 'В коллекции' : 'Не отмечено'}
            />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  )
}
