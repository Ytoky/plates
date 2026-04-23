import { combine } from 'effector'
import { REGIONS } from '../data/regions'
import { $entries } from './collection'

export const $stats = combine($entries, (entries) => {
  let collected = 0
  let withPhoto = 0
  for (const r of REGIONS) {
    const e = entries[r.code]
    if (!e) continue
    if (e.collected) collected++
    if (e.photo) withPhoto++
  }
  const total = REGIONS.length
  return {
    total,
    collected,
    withPhoto,
    progress: total ? collected / total : 0,
  }
})
