/**
 * Shared room matching utility.
 *
 * To update what drives room selection, edit MATCH_WEIGHTS:
 *   - Weight 0 = ignored in scoring (preference only, does not change room type)
 *   - Higher weight = stronger influence on which room is recommended
 *
 * bedding is multi-select: both room.attributes.bedding and user selections are arrays.
 *
 * Bedding uses two-step logic:
 *   1. Hard filter — rooms with zero bedding overlap are excluded from candidates entirely.
 *      A room that physically can't have the requested bed type is never recommended.
 *   2. Soft scoring — among remaining rooms, score by overlap / selectedLen.
 *      Rooms are rewarded for covering what was asked for; not penalised for having extra bed types.
 */

export const MATCH_WEIGHTS = {
  bedding:       10,  // primary differentiator — hard excluded if no overlap
  view:           8,  // major differentiator (marina vs city vs courtyard)
  bathroom:       7,  // major differentiator (shower vs bathtub vs separate bath)
  livingArea:     6,  // structural — separates standard from superior/deluxe/family
  kitchen:        6,  // structural — only family room has it
  balcony:        4,  // notable feature — only deluxe has it
  floor:          2,  // preference, not a room-type differentiator
  laundry:        1,  // preference
  pillows:        0,  // does not affect room type
  smoking:        0,  // not applicable (non-smoking property)
  accessibility:  0,  // pre-filtered before scoring (see findBestRoom)
}

/**
 * Score a single room against selected attributes.
 * Returns a numeric score; higher = better match.
 *
 * Rules:
 * - Boolean false values don't score (avoids Classic Room winning ties on absent features)
 * - bedding uses overlap / selectedLen: full credit for covering what was asked,
 *   no penalty for having additional bed types the user didn't request
 */
export function scoreRoom(room, selectedAttributes) {
  let score = 0

  for (const [key, selectedVal] of Object.entries(selectedAttributes)) {
    const weight = MATCH_WEIGHTS[key]
    if (weight === undefined || weight === 0) continue

    const roomVal = room.attributes[key]

    if (key === 'bedding') {
      const selectedBeds = Array.isArray(selectedVal) ? selectedVal : [selectedVal]
      const roomBeds = Array.isArray(roomVal) ? roomVal : [roomVal]
      const overlap = selectedBeds.filter((b) => roomBeds.includes(b)).length
      if (overlap > 0) {
        // Score by how well the room covers the user's selection, not by array similarity
        score += weight * (overlap / selectedBeds.length)
      }
      continue
    }

    if (roomVal !== selectedVal) continue
    // Boolean false doesn't score
    if (typeof selectedVal === 'boolean' && selectedVal === false) continue
    score += weight
  }

  return score
}

/**
 * Find the best matching room for the given selected attributes.
 *
 * Accessibility is pre-filtered: if user needs accessible, only accessible rooms are candidates.
 *
 * Bedding is hard-filtered: if the user has selected any bed types, rooms with zero bedding
 * overlap are excluded from the candidate pool before scoring.
 */
export function findBestRoom(rooms, selectedAttributes) {
  const needsAccessible = selectedAttributes.accessibility === true
  let pool = rooms.filter((r) => r.attributes.accessibility === needsAccessible)
  if (pool.length === 0) pool = rooms

  // Hard bedding filter: exclude rooms that share no bed types with the user's selection
  const selectedBeds = Array.isArray(selectedAttributes.bedding)
    ? selectedAttributes.bedding
    : selectedAttributes.bedding
      ? [selectedAttributes.bedding]
      : []

  if (selectedBeds.length > 0) {
    const compatible = pool.filter((r) => {
      const roomBeds = Array.isArray(r.attributes.bedding) ? r.attributes.bedding : [r.attributes.bedding]
      return selectedBeds.some((b) => roomBeds.includes(b))
    })
    // Only apply the filter if it leaves at least one candidate
    if (compatible.length > 0) pool = compatible
  }

  let bestRoom = pool[0]
  let bestScore = -1

  for (const room of pool) {
    const s = scoreRoom(room, selectedAttributes)
    if (s > bestScore) {
      bestScore = s
      bestRoom = room
    }
  }

  return bestRoom
}

/**
 * Check whether a set of selected attributes triggers a known conflict.
 * Handles multi-select bedding for the kitchen/twin conflict.
 * Returns the conflict object if found, or null.
 */
export function getActiveConflict(conflicts, selectedAttributes) {
  for (const conflict of conflicts) {
    const allMatch = conflict.attributes.every((entry) => {
      const colonIdx = entry.indexOf(':')
      const key = entry.slice(0, colonIdx)
      const rawVal = entry.slice(colonIdx + 1)

      // Special case: bedding:twin-only — fires when bedding is ONLY ['twin']
      if (key === 'bedding' && rawVal === 'twin-only') {
        const beds = Array.isArray(selectedAttributes.bedding)
          ? selectedAttributes.bedding
          : [selectedAttributes.bedding]
        return beds.length === 1 && beds[0] === 'twin'
      }

      let val
      if (rawVal === 'true') val = true
      else if (rawVal === 'false') val = false
      else if (!isNaN(Number(rawVal))) val = Number(rawVal)
      else val = rawVal

      return selectedAttributes[key] === val
    })
    if (allMatch) return conflict
  }
  return null
}
