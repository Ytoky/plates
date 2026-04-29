import { combine, createEvent, createStore, sample } from 'effector'
import type { AchievementView } from './achievements'
import { $achievements } from './achievements'

const SNAP_KEY = 'plates-hot-snap:v1'
const HOT_INIT_KEY = 'plates-hot-init:v1'

function sortIds(ids: string[]) {
  return [...ids].sort()
}

function readSnapshot(): string[] {
  if (typeof sessionStorage === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(SNAP_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return sortIds(parsed.filter((x): x is string => typeof x === 'string'))
  } catch {
    return []
  }
}

function writeSnapshot(ids: string[]) {
  if (typeof sessionStorage === 'undefined') return
  try {
    if (ids.length === 0) sessionStorage.removeItem(SNAP_KEY)
    else sessionStorage.setItem(SNAP_KEY, JSON.stringify(ids))
  } catch {
    void 0
  }
}

type HotState = { snapshot: string[]; hotIds: string[] }

export const clearHotAchievementIds = createEvent()
export const resetAchievementHotPersist = createEvent()

const initialSnap = readSnapshot()
export const $hotAchievementUnlockState = createStore<HotState>({
  snapshot: initialSnap,
  hotIds: [],
})
  .on(clearHotAchievementIds, (s): HotState => ({ ...s, hotIds: [] }))
  .on(resetAchievementHotPersist, (): HotState => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(HOT_INIT_KEY)
    } catch {
      void 0
    }
    writeSnapshot([])
    return { snapshot: [], hotIds: [] }
  })

$hotAchievementUnlockState.watch((s) => {
  writeSnapshot(s.snapshot)
})

sample({
  clock: $achievements,
  source: $hotAchievementUnlockState,
  fn: (state, list: AchievementView[]) => {
    const curr = sortIds(list.filter((a) => a.unlocked).map((a) => a.id))

    const hotInitDone = typeof localStorage !== 'undefined' && localStorage.getItem(HOT_INIT_KEY)
    if (!hotInitDone && curr.length > 0) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(HOT_INIT_KEY, '1')
      } catch {
        void 0
      }
      return {
        snapshot: curr,
        hotIds: [],
      }
    }

    const prevSet = new Set(state.snapshot)
    const gained = curr.filter((id) => !prevSet.has(id))
    const nextHot =
      gained.length > 0 ? [...new Set([...state.hotIds, ...gained])] : [...state.hotIds]

    return {
      snapshot: curr,
      hotIds: nextHot,
    }
  },
  target: $hotAchievementUnlockState,
})

export const $hotAchievementIds = combine($hotAchievementUnlockState, (s) => new Set(s.hotIds))
