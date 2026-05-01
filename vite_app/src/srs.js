// Time-compressed SM-2 SRS.
// Standard SM-2 uses days. For exam cramming, we use minutes/seconds.
// To switch back to day-based after the exam, change UNIT_MS to 86400000.

const UNIT_MS = 60 * 1000; // 1 minute = "1 day" in SM-2 terms (cramming mode)
// For long-term study, change to: const UNIT_MS = 24 * 60 * 60 * 1000;

const STORAGE_KEY = "us-flashcards-v1";

// Default state for a card
function defaultState(id) {
  return {
    id,
    ef: 2.5,           // ease factor (SM-2)
    interval: 0,       // intervals (in UNIT_MS)
    reps: 0,           // successful reps in a row
    due: Date.now(),   // when the card is due (ms timestamp)
    lapses: 0,         // total times missed
    history: [],       // recent grades for stats
  };
}

// SM-2 algorithm: grade is 0 (Again), 3 (Good), or 5 (Easy)
function applyGrade(state, grade) {
  const now = Date.now();
  const next = { ...state, history: [...state.history, { t: now, g: grade }].slice(-20) };

  if (grade < 3) {
    // FAIL — reset reps, short interval, increase lapses
    next.reps = 0;
    next.interval = 0.5; // half a unit (~30s in cram mode)
    next.lapses = (state.lapses || 0) + 1;
    next.ef = Math.max(1.3, state.ef - 0.2);
  } else {
    // PASS
    next.reps = state.reps + 1;
    if (next.reps === 1) next.interval = 1;
    else if (next.reps === 2) next.interval = 3;
    else next.interval = Math.round(state.interval * next.ef);
    // EF update from SM-2 formula
    next.ef = Math.max(1.3, state.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  }
  next.due = now + next.interval * UNIT_MS;
  return next;
}

// Mastery level for visualization (0 = new, 1 = learning, 2 = young, 3 = mature)
function masteryLevel(state) {
  if (!state || state.reps === 0) return 0;
  if (state.reps < 2) return 1;
  if (state.reps < 4) return 2;
  return 3;
}

// Pick the next card. Priority:
//   1. Cards due now (oldest due first)
//   2. New cards (never seen)
//   3. Soonest-due card (if everything is in the future)
function pickNext(cards, states, lastId = null) {
  const now = Date.now();
  const candidates = cards.map(c => ({ card: c, state: states[c.id] || defaultState(c.id) }));

  // exclude the card we just saw (avoid immediate repeat) unless it's the only one
  const filtered = candidates.length > 1 ? candidates.filter(x => x.card.id !== lastId) : candidates;

  // due now
  const dueNow = filtered.filter(x => x.state.due <= now && x.state.reps > 0);
  if (dueNow.length) {
    dueNow.sort((a, b) => a.state.due - b.state.due);
    return dueNow[0].card;
  }
  // new
  const newCards = filtered.filter(x => x.state.reps === 0 && (x.state.history?.length || 0) === 0);
  if (newCards.length) {
    return newCards[Math.floor(Math.random() * newCards.length)].card;
  }
  // soonest future
  filtered.sort((a, b) => a.state.due - b.state.due);
  return filtered[0].card;
}

// Aggregate stats for a deck
function deckStats(cards, states) {
  const now = Date.now();
  let nNew = 0, nLearning = 0, nYoung = 0, nMature = 0, nDue = 0, totalLapses = 0, seen = 0;
  for (const c of cards) {
    const s = states[c.id];
    if (!s || s.reps === 0) { nNew++; continue; }
    seen++;
    totalLapses += s.lapses || 0;
    if (s.due <= now) nDue++;
    const m = masteryLevel(s);
    if (m === 1) nLearning++;
    else if (m === 2) nYoung++;
    else if (m === 3) nMature++;
  }
  return {
    total: cards.length,
    new: nNew,
    learning: nLearning,
    young: nYoung,
    mature: nMature,
    due: nDue,
    seen,
    lapses: totalLapses,
    masteryPct: Math.round(((nYoung * 0.6 + nMature * 1.0) / cards.length) * 100),
  };
}

// Persistence
function loadStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveStates(states) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {}
}
function resetStates() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// Streak tracking (separate key)
const STREAK_KEY = "us-flashcards-streak-v1";
function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDay: null };
    return JSON.parse(raw);
  } catch { return { count: 0, lastDay: null }; }
}
function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const cur = loadStreak();
  if (cur.lastDay === today) return cur;
  // check if yesterday
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const next = { count: cur.lastDay === yest ? cur.count + 1 : 1, lastDay: today };
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(next)); } catch {}
  return next;
}

export {
  defaultState, applyGrade, pickNext, masteryLevel, deckStats,
  loadStates, saveStates, resetStates,
  loadStreak, bumpStreak,
  UNIT_MS,
};
