import { combine } from 'effector'
import { REGIONS } from '../data/regions'
import type { RegionEntry } from './collection'
import { $entries } from './collection'
import { $stats } from './stats'

export type AchievementTier = 'common' | 'rare' | 'epic'

export type AchievementView = {
  id: string
  title: string
  description: string
  unlocked: boolean
  tier: AchievementTier
}

const defs: Omit<AchievementView, 'unlocked'>[] = [
  {
    id: 'first',
    title: 'Первый код',
    description: 'Отметьте первый региональный код',
    tier: 'common',
  },
  { id: 'five', title: 'Пятёрка', description: 'Соберите 5 кодов', tier: 'common' },
  { id: 'ten', title: 'Десятка', description: 'Соберите 10 кодов', tier: 'common' },
  {
    id: 'fifteen',
    title: 'Половина второго десятка',
    description: 'Соберите 15 кодов',
    tier: 'common',
  },
  { id: 'twentyfive', title: 'Четверть пути', description: 'Соберите 25 кодов', tier: 'rare' },
  { id: 'fifty', title: 'Полсотни', description: 'Соберите 50 кодов', tier: 'rare' },
  {
    id: 'seventyfive',
    title: 'Три четверти',
    description: 'Соберите 75 кодов',
    tier: 'rare',
  },
  {
    id: 'half',
    title: 'Половина атласа',
    description: 'Соберите больше половины всех кодов из списка',
    tier: 'rare',
  },
  {
    id: 'almost',
    title: 'Почти всё',
    description: 'Останется меньше 10 кодов до полного списка',
    tier: 'epic',
  },
  {
    id: 'complete',
    title: 'Полный список',
    description: 'Отметьте все коды из списка',
    tier: 'epic',
  },
  { id: 'photo1', title: 'Снимок', description: 'Добавьте фото к любому коду', tier: 'common' },
  {
    id: 'photo5',
    title: 'Несколько кадров',
    description: 'Добавьте фото к 5 разным кодам',
    tier: 'common',
  },
  { id: 'photo10', title: 'Альбом', description: 'Добавьте фото к 10 разным кодам', tier: 'rare' },
  {
    id: 'photo25',
    title: 'Фотоархив',
    description: 'Добавьте фото к 25 разным кодам',
    tier: 'rare',
  },
  {
    id: 'photo_with_collect',
    title: 'Доказательство',
    description: 'У кода есть и отметка, и фото',
    tier: 'common',
  },
  {
    id: 'photo_everywhere',
    title: 'Под стеклом',
    description: 'У каждого собранного кода есть фото (от 15 шт.)',
    tier: 'epic',
  },
  {
    id: 'day_three',
    title: 'Разъезд',
    description: 'Отметьте 3 разных кода за один день',
    tier: 'common',
  },
  {
    id: 'day_five',
    title: 'Марафон',
    description: 'Отметьте 5 разных кодов за один день',
    tier: 'rare',
  },
  {
    id: 'day_ten',
    title: 'Рейс',
    description: 'Отметьте 10 разных кодов за один день',
    tier: 'epic',
  },
]

function maxCollectedSameCalendarDay(entries: Record<string, RegionEntry>): number {
  const byDay = new Map<string, number>()
  for (const r of REGIONS) {
    const e = entries[r.code]
    if (!e?.collected || e.collectedAt == null) continue
    const day = new Date(e.collectedAt).toISOString().slice(0, 10)
    byDay.set(day, (byDay.get(day) ?? 0) + 1)
  }
  return byDay.size ? Math.max(...byDay.values()) : 0
}

export const $achievements = combine($stats, $entries, (stats, entries) => {
  const left = stats.total - stats.collected
  const collectedWithPhoto = REGIONS.filter((r) => {
    const e = entries[r.code]
    return Boolean(e?.collected && e.photo)
  }).length

  const maxDay = maxCollectedSameCalendarDay(entries)
  const allCollectedHavePhoto =
    stats.collected > 0 && stats.withPhoto === stats.collected && stats.collected >= 15

  const unlocked = (id: string) => {
    switch (id) {
      case 'first':
        return stats.collected >= 1
      case 'five':
        return stats.collected >= 5
      case 'ten':
        return stats.collected >= 10
      case 'fifteen':
        return stats.collected >= 15
      case 'twentyfive':
        return stats.collected >= 25
      case 'fifty':
        return stats.collected >= 50
      case 'seventyfive':
        return stats.collected >= 75
      case 'half':
        return stats.total > 0 && stats.collected / stats.total >= 0.5
      case 'almost':
        return stats.total > 0 && left > 0 && left <= 9
      case 'complete':
        return stats.total > 0 && stats.collected === stats.total
      case 'photo1':
        return stats.withPhoto >= 1
      case 'photo5':
        return stats.withPhoto >= 5
      case 'photo10':
        return stats.withPhoto >= 10
      case 'photo25':
        return stats.withPhoto >= 25
      case 'photo_with_collect':
        return collectedWithPhoto >= 1
      case 'photo_everywhere':
        return allCollectedHavePhoto
      case 'day_three':
        return maxDay >= 3
      case 'day_five':
        return maxDay >= 5
      case 'day_ten':
        return maxDay >= 10
      default:
        return false
    }
  }

  return defs.map((d) => ({ ...d, unlocked: unlocked(d.id) }))
})

export const $achievementScore = combine(
  $achievements,
  (list) => list.filter((a) => a.unlocked).length,
)
