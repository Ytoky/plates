import { combine, createEvent, createStore, sample } from 'effector'
import { $achievements } from './achievements'
import { clearHotAchievementIds, resetAchievementHotPersist } from './achievementHot'

const ACK_KEY = 'plates-ach-ack:v1'
const BOOT_KEY = 'plates-ach-boot:v1'

function loadAck(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(ACK_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((x): x is string => typeof x === 'string'))
  } catch {
    return new Set()
  }
}

function saveAck(ids: Set<string>) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(ACK_KEY, JSON.stringify([...ids]))
  } catch {
    void 0
  }
}

export const acknowledgeAchievementIds = createEvent<string[]>()
export const acknowledgeAllUnlockedAchievements = createEvent()
export const resetAchievementAcknowledgements = createEvent()

export const $acknowledgedAchievementIds = createStore<Set<string>>(loadAck())
  .on(acknowledgeAchievementIds, (ack, ids) => {
    const next = new Set(ack)
    for (const id of ids) next.add(id)
    return next
  })
  .on(resetAchievementAcknowledgements, () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACK_KEY)
        localStorage.removeItem(BOOT_KEY)
      }
    } catch {
      void 0
    }
    return new Set()
  })

$acknowledgedAchievementIds.watch(saveAck)

sample({
  clock: acknowledgeAllUnlockedAchievements,
  source: combine($achievements, $acknowledgedAchievementIds),
  fn: ([list, ack]) => {
    const next = new Set(ack)
    for (const a of list) {
      if (a.unlocked) next.add(a.id)
    }
    return next
  },
  target: $acknowledgedAchievementIds,
})

sample({
  clock: $achievements,
  source: $acknowledgedAchievementIds,
  fn: (ack, list) => {
    if (typeof localStorage === 'undefined' || localStorage.getItem(BOOT_KEY)) {
      return ack
    }
    const next = new Set(ack)
    for (const a of list) {
      if (a.unlocked) next.add(a.id)
    }
    try {
      localStorage.setItem(BOOT_KEY, '1')
    } catch {
      void 0
    }
    return next
  },
  target: $acknowledgedAchievementIds,
})

export const $newAchievements = combine($achievements, $acknowledgedAchievementIds, (list, ack) =>
  list.filter((a) => a.unlocked && !ack.has(a.id)),
)

export const $hasUnseenAchievements = combine($newAchievements, (n) => n.length > 0)

sample({ clock: acknowledgeAchievementIds, target: clearHotAchievementIds })
sample({ clock: acknowledgeAllUnlockedAchievements, target: clearHotAchievementIds })

sample({
  clock: resetAchievementAcknowledgements,
  target: resetAchievementHotPersist,
})
