import { combine } from 'effector'
import { REGIONS } from '../data/regions'
import { $entries } from './collection'
import { $stats } from './stats'

export type AchievementView = {
  id: string
  title: string
  description: string
  unlocked: boolean
}

const defs: Omit<AchievementView, 'unlocked'>[] = [
  {
    id: 'first',
    title: 'Первый код',
    description: 'Отметьте первый региональный код',
  },
  {
    id: 'ten',
    title: 'Десятка',
    description: 'Соберите 10 кодов',
  },
  {
    id: 'twentyfive',
    title: 'Четверть пути',
    description: 'Соберите 25 кодов',
  },
  {
    id: 'fifty',
    title: 'Полсотни',
    description: 'Соберите 50 кодов',
  },
  {
    id: 'half',
    title: 'Половина атласа',
    description: 'Соберите больше половины всех кодов из списка',
  },
  {
    id: 'almost',
    title: 'Почти всё',
    description: 'Останется меньше 10 кодов до полного списка',
  },
  {
    id: 'complete',
    title: 'Полный список',
    description: 'Отметьте все коды из списка',
  },
  {
    id: 'photo1',
    title: 'Снимок',
    description: 'Добавьте фото к любому коду',
  },
  {
    id: 'photo10',
    title: 'Альбом',
    description: 'Добавьте фото к 10 разным кодам',
  },
  {
    id: 'photo_with_collect',
    title: 'Доказательство',
    description: 'У кода есть и отметка, и фото',
  },
]

export const $achievements = combine($stats, $entries, (stats, entries) => {
  const left = stats.total - stats.collected
  const collectedWithPhoto = REGIONS.filter((r) => {
    const e = entries[r.code]
    return Boolean(e?.collected && e.photo)
  }).length

  const unlocked = (id: string) => {
    switch (id) {
      case 'first':
        return stats.collected >= 1
      case 'ten':
        return stats.collected >= 10
      case 'twentyfive':
        return stats.collected >= 25
      case 'fifty':
        return stats.collected >= 50
      case 'half':
        return stats.total > 0 && stats.collected / stats.total >= 0.5
      case 'almost':
        return stats.total > 0 && left > 0 && left <= 9
      case 'complete':
        return stats.total > 0 && stats.collected === stats.total
      case 'photo1':
        return stats.withPhoto >= 1
      case 'photo10':
        return stats.withPhoto >= 10
      case 'photo_with_collect':
        return collectedWithPhoto >= 1
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
