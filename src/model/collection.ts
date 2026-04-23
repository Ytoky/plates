import { createEvent, createStore } from 'effector'
import { REGIONS } from '../data/regions'

export type RegionEntry = {
  name: string
  collected: boolean
  photo: string | null
  collectedAt: number | null
}

type PersistShape = {
  v: 1
  items: Record<string, { collected: boolean; photo: string | null; collectedAt: number | null }>
}

const STORAGE_KEY = 'plates-collection:v1'

function baseEntries(): Record<string, RegionEntry> {
  const out: Record<string, RegionEntry> = {}
  for (const r of REGIONS) {
    out[r.code] = {
      name: r.name,
      collected: false,
      photo: null,
      collectedAt: null,
    }
  }
  return out
}

function readPersisted(): PersistShape['items'] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistShape
    if (!parsed || parsed.v !== 1 || !parsed.items || typeof parsed.items !== 'object') return null
    return parsed.items
  } catch {
    return null
  }
}

function merge(base: Record<string, RegionEntry>, saved: PersistShape['items']) {
  const next: Record<string, RegionEntry> = { ...base }
  for (const code of Object.keys(next)) {
    const s = saved[code]
    if (!s) continue
    next[code] = {
      ...next[code],
      collected: Boolean(s.collected),
      photo: typeof s.photo === 'string' ? s.photo : null,
      collectedAt: typeof s.collectedAt === 'number' ? s.collectedAt : null,
    }
  }
  return next
}

function loadInitial(): Record<string, RegionEntry> {
  const base = baseEntries()
  const saved = readPersisted()
  if (!saved) return base
  return merge(base, saved)
}

function persist(entries: Record<string, RegionEntry>) {
  const items: PersistShape['items'] = {}
  for (const code of Object.keys(entries)) {
    const e = entries[code]
    items[code] = {
      collected: e.collected,
      photo: e.photo,
      collectedAt: e.collectedAt,
    }
  }
  const payload: PersistShape = { v: 1, items }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    void 0
  }
}

export const toggleCollected = createEvent<string>()
export const setPhoto = createEvent<{ code: string; photo: string | null }>()
export const resetAll = createEvent()

export const $entries = createStore<Record<string, RegionEntry>>(loadInitial())
  .on(toggleCollected, (state, code) => {
    const cur = state[code]
    if (!cur) return state
    const collected = !cur.collected
    return {
      ...state,
      [code]: {
        ...cur,
        collected,
        collectedAt: collected ? Date.now() : null,
      },
    }
  })
  .on(setPhoto, (state, { code, photo }) => {
    const cur = state[code]
    if (!cur) return state
    return {
      ...state,
      [code]: {
        ...cur,
        photo,
      },
    }
  })
  .on(resetAll, () => baseEntries())

$entries.watch(persist)
