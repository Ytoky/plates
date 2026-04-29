import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useUnit } from 'effector-react'
import { useRef } from 'react'
import type { RegionDef } from '../data/regions'
import { fileToResizedDataUrl } from '../lib/image'
import { $entries, setPhoto, toggleCollected } from '../model/collection'
import { PlateBadge } from './PlateBadge'

type Props = {
  open: boolean
  region: RegionDef | null
  onClose: () => void
}

export function RegionDialog({ open, region, onClose }: Props) {
  const entries = useUnit($entries)
  const toggle = useUnit(toggleCollected)
  const setPhotoEv = useUnit(setPhoto)
  const inputRef = useRef<HTMLInputElement | null>(null)

  if (!region) return null

  const entry = entries[region.code]

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <PlateBadge code={region.code} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {region.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Код на знаке · {region.code}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2.5}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(entry?.collected)}
                onChange={() => toggle(region.code)}
                color="primary"
              />
            }
            label={<Typography sx={{ fontWeight: 600 }}>В коллекции</Typography>}
          />

          <Box>
            <Typography
              variant="overline"
              color="primary.light"
              sx={{ fontWeight: 750, mb: 1, display: 'block' }}
            >
              Фото
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              Хранится только в браузере на этом устройстве
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ sm: 'center' }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PhotoCameraRoundedIcon />}
                onClick={() => inputRef.current?.click()}
              >
                Загрузить
              </Button>
              <input
                ref={inputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  const dataUrl = await fileToResizedDataUrl(file)
                  if (dataUrl) setPhotoEv({ code: region.code, photo: dataUrl })
                }}
              />
              {entry?.photo ? (
                <Button
                  color="error"
                  variant="text"
                  onClick={() => setPhotoEv({ code: region.code, photo: null })}
                >
                  Удалить
                </Button>
              ) : null}
            </Stack>
          </Box>

          {entry?.photo ? (
            <Box
              component="img"
              src={entry.photo}
              alt=""
              sx={{
                width: '100%',
                maxHeight: 340,
                objectFit: 'cover',
                borderRadius: 3,
                border: `1px solid ${alpha('#fff', 0.08)}`,
                boxShadow:
                  `0 0 0 1px ${alpha('#7dd3fc', 0.12)} inset, ` + `0 20px 50px rgba(0,0,0,0.35)`,
              }}
            />
          ) : (
            <Box
              sx={{
                borderRadius: 3,
                border: `1px dashed ${alpha('#fff', 0.2)}`,
                bgcolor: alpha('#000', 0.2),
                py: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Пока без фото
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Готово
        </Button>
      </DialogActions>
    </Dialog>
  )
}
