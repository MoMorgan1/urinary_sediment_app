/**
 * Time-compressed SM-2 spaced repetition.
 *
 * Standard SM-2 measures intervals in days. For exam cramming we treat
 * one minute as one "day" so every learning curve plays out within a
 * single study session. Set UNIT_MS to 24 * 60 * 60 * 1000 to restore
 * standard day-based intervals.
 *
 * @typedef {Object} CardState
 * @property {string} id
 * @property {number} ef        SM-2 ease factor (>= 1.3)
 * @property {number} interval  Interval in UNIT_MS units
 * @property {number} reps      Successful reps in a row
 * @property {number} due       Timestamp (ms) when the card next becomes due
 * @property {number} lapses    Total times graded "Again"
 * @property {{t:number,g:number}[]} history  Recent grades, capped at 20
 *
 * @typedef {0|3|5} Grade
 *
 * @typedef {Object} DeckStats
 * @property {number} total
 * @property {number} new
 * @property {number} learning
 * @property {number} young
 * @property {number} mature
 * @property {number} due
 * @property {number} seen
 * @property {number} lapses
 * @property {number} masteryPct
 */

export const UNIT_MS = 60 * 1000;

const STORAGE_KEY = "us-flashcards-v1";
const STREAK_KEY = "us-flashcards-streak-v1";
const MIN_EF = 1.3;
const HISTORY_LIMIT = 20;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * @param {string} id
 * @returns {CardState}
 */
export function defaultState(id) {
  return {
    id,
    ef: 2.5,
    interval: 0,
    reps: 0,
    due: Date.now(),
    lapses: 0,
    history: [],
  };
}

/**
 * Apply an SM-2 grade to a card state and return the new state.
 * @param {CardState} state
 * @param {Grade} grade
 * @returns {CardState}
 */
export function applyGrade(state, grade) {
  const now = Date.now();
  const history = [...state.history, { t: now, g: grade }].slice(-HISTORY_LIMIT);

  if (grade < 3) {
    return {
      ...state,
      history,
      reps: 0,
      interval: 0.5,
      lapses: (state.lapses || 0) + 1,
      ef: Math.max(MIN_EF, state.ef - 0.2),
      due: now + 0.5 * UNIT_MS,
    };
  }

  const reps = state.reps + 1;
  let interval;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 3;
  else interval = Math.round(state.interval * state.ef);

  const ef = Math.max(
    MIN_EF,
    state.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  );

  return {
    ...state,
    history,
    reps,
    interval,
    ef,
    due: now + interval * UNIT_MS,
  };
}

/**
 * Mastery bucket for visualization.
 * @param {CardState | undefined} state
 * @returns {0|1|2|3} 0 = new, 1 = learning, 2 = young, 3 = mature
 */
export function masteryLevel(state) {
  if (!state || state.reps === 0) return 0;
  if (state.reps < 2) return 1;
  if (state.reps < 4) return 2;
  return 3;
}

/**
 * Pick the next card. Priority:
 *   1. Cards due now (oldest due first)
 *   2. Brand-new cards (random)
 *   3. Soonest-due card if everything is in the future
 *
 * Avoids repeating any of the recently-shown cards. We need a queue rather
 * than just the last card: when the user keeps skipping, the just-skipped
 * card stays the oldest-due (its `due` timestamp didn't move), so excluding
 * only the immediate previous card causes a ping-pong between two cards.
 *
 * Falls back to a smaller exclusion set, then no exclusion, when the deck
 * is too small to satisfy the full recents list.
 *
 * @param {{id:string}[]} cards
 * @param {Record<string, CardState>} states
 * @param {string[]} recentIds  Most-recent last; older first.
 */
export function pickNext(cards, states, recentIds = []) {
  if (cards.length === 0) return null;

  const now = Date.now();
  const candidates = cards.map((c) => ({
    card: c,
    state: states[c.id] || defaultState(c.id),
  }));

  const poolFor = (excluded) =>
    candidates.length > excluded.size
      ? candidates.filter((x) => !excluded.has(x.card.id))
      : [];

  let pool = poolFor(new Set(recentIds));
  if (pool.length === 0 && recentIds.length > 0) {
    pool = poolFor(new Set(recentIds.slice(-1)));
  }
  if (pool.length === 0) pool = candidates;

  const dueNow = pool
    .filter((x) => x.state.due <= now && x.state.reps > 0)
    .sort((a, b) => a.state.due - b.state.due);
  if (dueNow.length) return dueNow[0].card;

  const fresh = pool.filter(
    (x) => x.state.reps === 0 && (x.state.history?.length || 0) === 0
  );
  if (fresh.length) {
    return fresh[Math.floor(Math.random() * fresh.length)].card;
  }

  pool.sort((a, b) => a.state.due - b.state.due);
  return pool[0].card;
}

/**
 * @param {{id:string}[]} cards
 * @param {Record<string, CardState>} states
 * @returns {DeckStats}
 */
export function deckStats(cards, states) {
  const now = Date.now();
  let nNew = 0,
    nLearning = 0,
    nYoung = 0,
    nMature = 0,
    nDue = 0,
    totalLapses = 0,
    seen = 0;

  for (const c of cards) {
    const s = states[c.id];
    if (!s || s.reps === 0) {
      nNew++;
      continue;
    }
    seen++;
    totalLapses += s.lapses || 0;
    if (s.due <= now) nDue++;
    const m = masteryLevel(s);
    if (m === 1) nLearning++;
    else if (m === 2) nYoung++;
    else if (m === 3) nMature++;
  }

  const masteryPct =
    cards.length === 0
      ? 0
      : Math.round(((nYoung * 0.6 + nMature * 1.0) / cards.length) * 100);

  return {
    total: cards.length,
    new: nNew,
    learning: nLearning,
    young: nYoung,
    mature: nMature,
    due: nDue,
    seen,
    lapses: totalLapses,
    masteryPct,
  };
}

/* ------------------------------ Persistence ------------------------------ */

/** @returns {Record<string, CardState>} */
export function loadStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** @param {Record<string, CardState>} states */
export function saveStates(states) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    /* storage unavailable (private mode, quota) — silently degrade */
  }
}

export function resetStates() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* -------------------------------- Streak -------------------------------- */

/** @typedef {{count:number, lastDay:string|null}} Streak */

const isoDay = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);

/** @returns {Streak} */
export function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lastDay: null };
  } catch {
    return { count: 0, lastDay: null };
  }
}

/**
 * Increment streak if this is a new calendar day. Idempotent within a day.
 * @returns {Streak}
 */
export function bumpStreak() {
  const today = isoDay();
  const cur = loadStreak();
  if (cur.lastDay === today) return cur;

  const yesterday = isoDay(Date.now() - ONE_DAY_MS);
  const next = {
    count: cur.lastDay === yesterday ? cur.count + 1 : 1,
    lastDay: today,
  };
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
