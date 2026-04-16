/**
 * Shared room matching utility.
 *
 * To update what drives room selection, edit MATCH_WEIGHTS:
 *   - Weight 0 = ignored in scoring (preference only, does not change room type)
 *   - Higher weight = stronger influence on which room is recommended
 *
 * bedding is multi-select: both room.attributes.bedding and user selections are arrays.
 * Scoring uses array intersection — more overlap = higher score.
 */

export const MATCH_WEIGHTS = {
  bedding:       10,  // primary differentiator — bed config determines room type
  view:           8,  // major differentiator (marina vs city vs courtyard)
  bathroom:       7,  // major differentiator (shower vs bathtub vs separate bath)
  livingArea:     6,  // structural — separates standard from superior/deluxe
  kitchen:        6,  // structural — only family room has it
  balcony:        4,  // notable feature — only deluxe has it
  floor:          2,  // preference, not a room-type differentiator
  laundry:        1,  // preference
  pillows:        0,  // does not affect room type
  smoking:        0,  // requirement, handled separately if needed
  accessibility:  0,  // pre-filtered before scoring (see findBestRoom)
}

/**
 * Score a single room against selected attributes.
 * Returns a numeric score; higher = better match.
 *
 * Rules:
 * - Boolean false values don't score (avoids Classic Room winning ties on absent features)
 * - bedding uses array intersection weighted by overlap ratio
 */
export function scoreRoom(room, selectedAttributes) {
  let score = 0

  for (const [key, selectedVal] of Object.entries(selectedAttributes)) {
    const weight = MATCH_WEIGHTS[key]
    if (weight === undefined || weight === 0) continue

    const roomVal = room.attributes[key]

    // Multi-select bedding: score by how much the room's beds overlap with selection
    if (key === 'bedding') {
      const selectedBeds = Array.isArray(selectedVal) ? selectedVal : [selectedVal]
      const roomBeds = Array.isArray(roomVal) ? roomVal : [roomVal]
      const overlap = selectedBeds.filter((b) => roomBeds.includes(b)).length
      if (overlap > 0) {
        score += weight * (overlap / Math.max(selectedBeds.length, roomBeds.length))
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
 * Accessibility is pre-filtered: if user needs accessible, only accessible rooms are candidates.
 */
export function findBestRoom(rooms, selectedAttributes) {
  const needsAccessible = selectedAttributes.accessibility === true
  const pool = rooms.filter((r) => r.attributes.accessibility === needsAccessible)
  const candidates = pool.length > 0 ? pool : rooms

  let bestRoom = candidates[0]
  let bestScore = -1

  for (const room of candidates) {
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
