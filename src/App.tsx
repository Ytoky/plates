import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useUnit } from 'effector-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { REGIONS, type RegionDef } from './data/regions'
import { AchievementsDrawer } from './components/AchievementsDrawer'
import { RegionCard } from './components/RegionCard'
import { RegionDialog } from './components/RegionDialog'
import {
  $newAchievements,
  acknowledgeAchievementIds,
  resetAchievementAcknowledgements,
} from './model/achievementAck'
import { $hotAchievementUnlockState } from './model/achievementHot'
import { $entries, resetAll } from './model/collection'
import { $stats } from './model/stats'
type Filter = 'all' | 'done' | 'todo'

export default function App() {
  const theme = useTheme()
  const entries = useUnit($entries)
  const stats = useUnit($stats)
  const reset = useUnit(resetAll)
  const resetAchAck = useUnit(resetAchievementAcknowledgements)
  const newAchievements = useUnit($newAchievements)
  const acknowledgeIds = useUnit(acknowledgeAchievementIds)
  const hotAchievementState = useUnit($hotAchievementUnlockState)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [achOpen, setAchOpen] = useState(false)
  const [active, setActive] = useState<RegionDef | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastText, setToastText] = useState('')
  const toastKeyRef = useRef('')
  const newAchRef = useRef(newAchievements)
  newAchRef.current = newAchievements

  useEffect(() => {
    const key = newAchievements
      .map((a) => a.id)
      .sort()
      .join('|')
    if (!key) {
      toastKeyRef.current = ''
      setToastOpen(false)
      return
    }
    if (key === toastKeyRef.current) return
    toastKeyRef.current = key
    const novelById = new Map(newAchievements.map((a) => [a.id, a]))
    const hotOrdered = hotAchievementState.hotIds
      .map((id) => novelById.get(id)?.title)
      .filter(Boolean) as string[]
    const hotSet = new Set(hotAchievementState.hotIds)
    const novelRest = newAchievements.filter((a) => !hotSet.has(a.id)).map((a) => a.title)
    const sortedNames = [...hotOrdered, ...novelRest]
    const hotBurst = hotOrdered.length >= 2
    let text: string
    if (hotBurst) {
      text = `${hotOrdered.length} за раз: ${hotOrdered.join(', ')}${novelRest.length ? `. Ещё: ${novelRest.join(', ')}.` : '.'}`
    } else if (sortedNames.length === 1) {
      text =
        hotOrdered.length === 1
          ? `Только что: «${sortedNames[0]}»`
          : `Разблокировано: «${sortedNames[0]}»`
    } else {
      text =
        hotOrdered.length === 1
          ? `Главное: «${hotOrdered[0]}». Ещё: ${novelRest.join(', ')}.`
          : `Новые достижения (${sortedNames.length}): ${sortedNames.join(', ')}`
    }
    setToastText(text)
    setToastOpen(true)
  }, [newAchievements, hotAchievementState.hotIds])

  const sorted = useMemo(() => [...REGIONS].sort((a, b) => Number(a.code) - Number(b.code)), [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter((r) => {
      const e = entries[r.code]
      if (filter === 'done' && !e?.collected) return false
      if (filter === 'todo' && e?.collected) return false
      if (!q) return true
      if (r.code.toLowerCase().includes(q)) return true
      return r.name.toLowerCase().includes(q)
    })
  }, [entries, filter, query, sorted])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        pb: `max(${theme.spacing(5)}, env(safe-area-inset-bottom, 0px))`,
        pt: `env(safe-area-inset-top, 0px)`,
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: 'blur(18px)' }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              gap: { xs: 1, sm: 2 },
              py: { xs: 1.75, sm: 2 },
              minHeight: { xs: 58, sm: 64 },
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
                backgroundImage: `linear-gradient(155deg, ${alpha(theme.palette.primary.main, 0.22)}, transparent)`,
                boxShadow: `inset 0 1px 0 ${alpha('#fff', 0.06)}`,
              }}
            >
              <Typography sx={{ fontWeight: 850, letterSpacing: 0.06, fontSize: 13 }}>
                РФ
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 200 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Регионы номеров
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Коллекции без сервера — данные только в браузере
              </Typography>
            </Box>
            <Chip
              color="primary"
              variant="outlined"
              label={`${stats.collected}/${stats.total}`}
              sx={{ fontWeight: 750, px: 0.75, bgcolor: alpha('#000', 0.2), borderRadius: 2 }}
            />
            <Tooltip title="Достижения">
              <IconButton
                color="primary"
                onClick={() => setAchOpen(true)}
                sx={{
                  minWidth: 48,
                  minHeight: 48,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
                }}
                aria-label="Достижения"
              >
                <Badge
                  color="warning"
                  variant="dot"
                  invisible={newAchievements.length === 0}
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <EmojiEventsOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Сбросить прогресс">
              <IconButton
                color="error"
                onClick={() => setResetOpen(true)}
                sx={{
                  minWidth: 48,
                  minHeight: 48,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.28)}`,
                }}
                aria-label="Сбросить прогресс"
              >
                <RestartAltOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 2.5, md: 4 }, flex: 1 }}>
        <Stack spacing={2.5}>
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              bgcolor: alpha('#fff', 0.038),
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
              justifyContent="space-between"
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="overline"
                  color="primary.light"
                  sx={{ fontWeight: 750, mb: 0.5 }}
                >
                  Общий прогресс
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 820, mb: 1.75, letterSpacing: '-0.02em' }}
                >
                  {stats.collected} из {stats.total} региональных кодов
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.round(stats.progress * 100)}
                  sx={{ height: 12 }}
                />
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flexShrink: 0 }}>
                <Chip
                  label={`${Math.round(stats.progress * 100)}% собрано`}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), border: 'none' }}
                />
                <Chip label={`Фото · ${stats.withPhoto}`} variant="outlined" />
              </Stack>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.25 },
              bgcolor: alpha('#fff', 0.026),
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 0 },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
            >
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                label="Поиск по коду или названию"
                placeholder="Например: 77 или Москва"
                fullWidth
                sx={{ flex: { md: 2 } }}
              />
              <ToggleButtonGroup
                exclusive
                value={filter}
                onChange={(_, v: Filter | null) => v && setFilter(v)}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'stretch', md: 'center' },
                }}
                color="primary"
              >
                <ToggleButton value="all">Все</ToggleButton>
                <ToggleButton value="done">Собрано</ToggleButton>
                <ToggleButton value="todo">Осталось</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
            Отображено карт в сетке: {visible.length}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: { xs: 2, sm: 2 },
            }}
          >
            {visible.map((r) => (
              <RegionCard
                key={r.code}
                region={r}
                entry={entries[r.code]}
                onOpen={() => setActive(r)}
              />
            ))}
          </Box>
        </Stack>
      </Container>

      <RegionDialog open={Boolean(active)} region={active} onClose={() => setActive(null)} />
      <AchievementsDrawer open={achOpen} onClose={() => setAchOpen(false)} />

      <Snackbar
        open={toastOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={20000}
        sx={{
          bottom: { xs: `max(20px, env(safe-area-inset-bottom))`, sm: 28 },
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          width: { xs: 'calc(100vw - 20px)', sm: 'min(640px, calc(100vw - 80px))' },
          maxWidth: 'none',
          boxSizing: 'border-box',
        }}
        onClose={() => {
          acknowledgeIds(newAchRef.current.map((a) => a.id))
          setToastOpen(false)
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => {
            acknowledgeIds(newAchRef.current.map((a) => a.id))
            setToastOpen(false)
          }}
          sx={{
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            py: { xs: 2, sm: 1.75 },
            px: { xs: 2, sm: 2 },
            backdropFilter: 'blur(14px)',
            bgcolor: alpha(theme.palette.background.paper, 0.94),
            color: theme.palette.text.primary,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
            '& .MuiAlert-message': {
              py: 0,
              px: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              fontSize: { xs: '0.98rem', sm: '0.95rem' },
              lineHeight: 1.45,
              width: '100%',
            },
            '& .MuiAlert-icon': {
              fontSize: { xs: 28, sm: 24 },
              py: 0,
            },
          }}
        >
          {toastText}
        </Alert>
      </Snackbar>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Сбросить прогресс?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Будут удалены отметки и локально сохранённые фото для этого сайта в текущем браузере.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Отмена</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              reset()
              resetAchAck()
              setResetOpen(false)
            }}
          >
            Сбросить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
