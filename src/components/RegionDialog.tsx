import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
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
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <PlateBadge code={region.code} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              {region.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Код региона на знаке: {region.code}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(entry?.collected)}
                onChange={() => toggle(region.code)}
                color="primary"
              />
            }
            label="Отмечено как встреченное"
          />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Фото (хранится локально в браузере)
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
            >
              <Button
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={() => inputRef.current?.click()}
              >
                Загрузить фото
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
                  Удалить фото
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
                maxHeight: 360,
                objectFit: 'cover',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          ) : (
            <Box
              sx={{
                borderRadius: 2,
                border: '1px dashed rgba(255,255,255,0.18)',
                p: 3,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              Фото ещё не добавлено
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Готово
        </Button>
      </DialogActions>
    </Dialog>
  )
}
