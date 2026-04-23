import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import {
  AppBar,
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
  Stack,
  TextField,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { useUnit } from 'effector-react'
import { useMemo, useState } from 'react'
import { REGIONS, type RegionDef } from './data/regions'
import { AchievementsDrawer } from './components/AchievementsDrawer'
import { RegionCard } from './components/RegionCard'
import { RegionDialog } from './components/RegionDialog'
import { $entries, resetAll } from './model/collection'
import { $stats } from './model/stats'
type Filter = 'all' | 'done' | 'todo'

export default function App() {
  const entries = useUnit($entries)
  const stats = useUnit($stats)
  const reset = useUnit(resetAll)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [achOpen, setAchOpen] = useState(false)
  const [active, setActive] = useState<RegionDef | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

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
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: 'blur(10px)' }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Регионы номеров
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Отмечайте коды, прикрепляйте фото — всё хранится локально
            </Typography>
          </Box>
          <Chip
            color="primary"
            variant="outlined"
            label={`${stats.collected} / ${stats.total}`}
            sx={{ fontWeight: 700 }}
          />
          <Tooltip title="Достижения">
            <IconButton color="primary" onClick={() => setAchOpen(true)} aria-label="Достижения">
              <EmojiEventsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Сбросить прогресс">
            <IconButton
              color="error"
              onClick={() => setResetOpen(true)}
              aria-label="Сбросить прогресс"
            >
              <RestartAltOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Box>
            <LinearProgress
              variant="determinate"
              value={Math.round(stats.progress * 100)}
              sx={{ height: 10, borderRadius: 999, mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Прогресс: {Math.round(stats.progress * 100)}% · с фото: {stats.withPhoto}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Поиск"
              placeholder="Код или название"
              fullWidth
            />
            <ToggleButtonGroup
              exclusive
              value={filter}
              onChange={(_, v: Filter | null) => v && setFilter(v)}
              sx={{ flexShrink: 0 }}
              color="primary"
            >
              <ToggleButton value="all">Все</ToggleButton>
              <ToggleButton value="done">Собрано</ToggleButton>
              <ToggleButton value="todo">Осталось</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Показано: {visible.length}
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
              gap: 2,
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
