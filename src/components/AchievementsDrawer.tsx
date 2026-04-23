import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useUnit } from 'effector-react'
import { $achievementScore, $achievements } from '../model/achievements'

type Props = {
  open: boolean
  onClose: () => void
}

export function AchievementsDrawer({ open, onClose }: Props) {
  const achievements = useUnit($achievements)
  const score = useUnit($achievementScore)

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 420 }, maxWidth: '100vw' }} role="presentation">
        <Stack spacing={1} sx={{ p: 2.5, pb: 1 }}>
          <Typography variant="h6">Достижения</Typography>
          <Typography variant="body2" color="text.secondary">
            Разблокировано: {score} / {achievements.length}
          </Typography>
        </Stack>
        <Divider />
        <List sx={{ py: 1 }}>
          {achievements.map((a) => (
            <ListItem key={a.id} sx={{ alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.25 }}>
                <EmojiEventsOutlinedIcon color={a.unlocked ? 'primary' : 'disabled'} />
              </ListItemIcon>
              <ListItemText
                primary={a.title}
                secondary={a.description}
                primaryTypographyProps={{ sx: { fontWeight: 700, opacity: a.unlocked ? 1 : 0.55 } }}
                secondaryTypographyProps={{ sx: { opacity: a.unlocked ? 0.85 : 0.55 } }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
