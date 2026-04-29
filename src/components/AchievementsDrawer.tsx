import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import {
  Box,
  Chip,
  Drawer,
  Fade,
  LinearProgress,
  Paper,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material'
import { alpha, keyframes, lighten, useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useUnit } from 'effector-react'
import { useMemo } from 'react'
import type { AchievementView } from '../model/achievements'
import { $achievementScore, $achievements } from '../model/achievements'
import { $hotAchievementUnlockState } from '../model/achievementHot'
import { $newAchievements, acknowledgeAllUnlockedAchievements } from '../model/achievementAck'

type Props = {
  open: boolean
  onClose: () => void
}

function tierAccent(tier: AchievementView['tier'], unlocked: boolean) {
  if (!unlocked) return { border: alpha('#fff', 0.08), glow: alpha('#64748b', 0.2) }
  if (tier === 'epic')
    return {
      border: lighten('#c4b5fd', 0.05),
      glow: alpha('#c4b5fd', 0.55),
    }
  if (tier === 'rare')
    return {
      border: lighten('#7dd3fc', 0.05),
      glow: alpha('#7dd3fc', 0.45),
    }
  return { border: alpha('#7dd3fc', 0.45), glow: alpha('#7dd3fc', 0.28) }
}

const hotGlow = keyframes`
  0%, 100% {
    opacity: 1;
    box-shadow:
      0 0 0 2px rgba(125, 211, 252, 0.55),
      0 0 28px rgba(125, 211, 252, 0.45),
      0 0 64px rgba(196, 181, 253, 0.2);
    filter: saturate(1.05);
  }
  45% {
    opacity: 1;
    box-shadow:
      0 0 0 3px rgba(196, 181, 253, 0.65),
      0 0 48px rgba(125, 211, 252, 0.55),
      0 0 90px rgba(196, 181, 253, 0.32);
    filter: saturate(1.2);
  }
`

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

function AchievementRow({
  a,
  isNovel,
  isHot,
  index,
}: {
  a: AchievementView
  isNovel: boolean
  isHot: boolean
  index: number
}) {
  const theme = useTheme()
  const accent = tierAccent(a.tier, a.unlocked)

  return (
    <Fade in timeout={360} style={{ transitionDelay: `${Math.min(index, 14) * 36}ms` }}>
      <Paper
        variant="outlined"
        sx={{
          px: { xs: 2.25, sm: 2 },
          py: { xs: 2.15, sm: 1.75 },
          borderRadius: 2,
          borderColor: accent.border,
          borderWidth: isHot ? 2 : 1,
          bgcolor:
            isHot && a.unlocked
              ? alpha(theme.palette.secondary.main, 0.09)
              : alpha('#0f172a', a.unlocked ? (isNovel ? 0.5 : 0.45) : 0.25),
          transform: 'translateZ(0)',
          ...(isHot && a.unlocked
            ? {
                animation: `${hotGlow} 1.85s ease-in-out infinite`,
              }
            : isNovel && a.unlocked
              ? {
                  boxShadow: `inset 0 0 0 1px ${alpha(accent.glow, 0.45)}, 0 0 20px ${alpha(accent.border, 0.4)}`,
                }
              : {}),
          transition: 'box-shadow 0.35s ease, transform 0.2s ease',
          '&:hover': {
            bgcolor: alpha('#0f172a', a.unlocked ? 0.82 : 0.35),
          },
          '@supports (backdrop-filter: blur(12px))':
            isHot && a.unlocked ? { backdropFilter: 'blur(10px)' } : {},
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: { xs: 50, sm: 44 },
              height: { xs: 50, sm: 44 },
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: a.unlocked
                ? alpha('#7dd3fc', isHot ? 0.5 : isNovel ? 0.35 : 0.2)
                : alpha('#fff', 0.06),
              color: a.unlocked ? 'primary.main' : 'text.disabled',
              animation: isHot && a.unlocked ? `${fadeUp} 0.45s ease-out both 0ms` : undefined,
            }}
          >
            {a.unlocked ? (
              <EmojiEventsRoundedIcon sx={{ fontSize: { xs: 28, sm: 24 } }} />
            ) : (
              <LockRoundedIcon fontSize="small" />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              flexWrap="wrap"
              sx={{ mb: 0.25 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 850,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1rem', sm: '0.875rem' },
                  opacity: a.unlocked ? 1 : 0.45,
                  color: isHot && a.unlocked ? 'primary.light' : undefined,
                  textShadow: isHot
                    ? `0 0 22px ${alpha(theme.palette.primary.main, 0.65)}`
                    : undefined,
                }}
              >
                {a.title}
              </Typography>
              {isHot && a.unlocked && (
                <Chip
                  size="small"
                  color="warning"
                  label="Сейчас получено!"
                  sx={{ fontWeight: 800, height: { xs: 28, sm: 24 }, fontSize: { xs: 12, sm: 11 } }}
                />
              )}
              {isNovel && a.unlocked && !isHot && (
                <Chip
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.28),
                    color: 'warning.light',
                    fontWeight: 700,
                    height: { xs: 26, sm: 22 },
                  }}
                  label="Новое"
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {a.description}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  )
}

const drawerSx = (theme: Theme, fullBleedMobile: boolean) => ({
  bgcolor: alpha(theme.palette.background.default, 0.98),
  backgroundImage: `linear-gradient(165deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 45%), radial-gradient(80% 50% at 100% 0%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent)`,
  ...(fullBleedMobile
    ? {
        width: '100%',
        borderTopLeftRadius: { xs: 20, sm: 0 },
        borderTopRightRadius: { xs: 20, sm: 0 },
        maxHeight: { xs: 'min(94dvh, 94vh)', sm: 'none' },
        minHeight: { xs: '72dvh', sm: undefined },
        alignSelf: 'stretch',
        pb: `max(14px, env(safe-area-inset-bottom))`,
      }
    : {
        borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
      }),
})

export function AchievementsDrawer({ open, onClose }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const achievements = useUnit($achievements)
  const score = useUnit($achievementScore)
  const pendingNew = useUnit($newAchievements)
  const hotState = useUnit($hotAchievementUnlockState)
  const acknowledge = useUnit(acknowledgeAllUnlockedAchievements)

  const newIds = useMemo(() => new Set(pendingNew.map((x) => x.id)), [pendingNew])
  const hotSet = useMemo(() => new Set(hotState.hotIds), [hotState.hotIds])

  const ordered = useMemo(() => {
    const byId = new Map(achievements.map((a) => [a.id, a]))
    const heads: AchievementView[] = []
    const seen = new Set<string>()
    for (const id of hotState.hotIds) {
      const a = byId.get(id)
      if (a) {
        heads.push(a)
        seen.add(id)
      }
    }
    for (const id of [...newIds].sort()) {
      const a = byId.get(id)
      if (a && !seen.has(id)) {
        heads.push(a)
        seen.add(id)
      }
    }
    const rest = achievements.filter((a) => !seen.has(a.id))
    return [...heads, ...rest]
  }, [achievements, hotState.hotIds, newIds])

  const pct = achievements.length ? (score / achievements.length) * 100 : 0

  const handleClose = () => {
    acknowledge()
    onClose()
  }

  const content = (
    <Box sx={{ width: '100%', maxHeight: 'inherit', overflowY: 'auto' }} role="presentation">
      <Stack spacing={0} sx={{ p: 0 }}>
        <Box
          sx={{
            px: { xs: 2.25, sm: 2.5 },
            pb: { xs: 1.75, sm: 2 },
            pt: { xs: 2.75, sm: 2.5 },
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: alpha(theme.palette.background.default, 0.72),
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          {isMobile ? (
            <Box
              sx={{
                width: 40,
                height: 5,
                borderRadius: 999,
                bgcolor: alpha('#fff', 0.15),
                mx: 'auto',
                mb: 2,
              }}
            />
          ) : null}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <EmojiEventsRoundedIcon sx={{ fontSize: { xs: 40, sm: 36 }, color: 'primary.light' }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.15rem', sm: undefined },
                }}
              >
                Достижения
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {score} из {achievements.length} разблокировано
              </Typography>
            </Box>
            <Typography variant="caption" color="primary.light" sx={{ fontWeight: 800 }}>
              {Math.round(pct)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: { xs: 10, sm: 8 },
              borderRadius: 999,
              bgcolor: alpha('#fff', 0.08),
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          />
        </Box>

        <Box
          sx={{
            px: { xs: 2.25, sm: 2.5 },
            pb: { xs: `max(110px, calc(24px + env(safe-area-inset-bottom)))`, sm: 3 },
            pt: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 1.25 },
          }}
        >
          {ordered.map((a, i) => (
            <AchievementRow
              key={a.id}
              a={a}
              isHot={hotSet.has(a.id)}
              isNovel={newIds.has(a.id)}
              index={i}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  )

  const paperSx = drawerSx(theme, isMobile)

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        disableSwipeToOpen
        PaperProps={{
          sx: paperSx,
        }}
        ModalProps={{ keepMounted: true }}
        SlideProps={{
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          timeout: 420,
        }}
      >
        {content}
      </SwipeableDrawer>
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      SlideProps={{
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        timeout: 380,
      }}
      PaperProps={{
        sx: { ...paperSx, width: { sm: 520, md: 560 }, maxWidth: '100vw' },
      }}
    >
      {content}
    </Drawer>
  )
}
