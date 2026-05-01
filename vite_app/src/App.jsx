import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";

import { DECKS } from "./cards.js";
import {
  defaultState,
  applyGrade,
  pickNext,
  masteryLevel,
  deckStats,
  loadStates,
  saveStates,
  resetStates,
  loadStreak,
  bumpStreak,
} from "./srs.js";
import { GRADES } from "./constants.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import { Header } from "./components/Header.jsx";
import { DeckSwitcher } from "./components/DeckSwitcher.jsx";
import { StatsPanel, MasteryBar } from "./components/StatsPanel.jsx";
import { Flashcard } from "./components/Flashcard.jsx";

const ADVANCE_DELAY_MS = 180;
const RECENTS_LIMIT = 3;

export default function App() {
  const [deckKey, setDeckKey] = useState("all");
  const [states, setStates] = useState(loadStates);
  const [streak, setStreak] = useState(loadStreak);
  const [showStats, setShowStats] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const recentsRef = useRef([]);

  const deck = DECKS[deckKey];
  const cards = deck.cards;

  const pushRecent = useCallback((id) => {
    const next = [...recentsRef.current, id].slice(-RECENTS_LIMIT);
    recentsRef.current = next;
  }, []);

  // Pick the first card for this deck. We intentionally do NOT depend on
  // `states` here — re-running the selector on every grade would cause the
  // current card to swap mid-review.
  useEffect(() => {
    recentsRef.current = [];
    setCurrentCard(pickNext(cards, loadStates(), []));
    setRevealed(false);
  }, [cards]);

  useEffect(() => {
    saveStates(states);
  }, [states]);

  const stats = useMemo(() => deckStats(cards, states), [cards, states]);

  const grade = useCallback(
    (g) => {
      if (!currentCard) return;
      const id = currentCard.id;
      setStates((prev) => {
        const cur = prev[id] || defaultState(id);
        return { ...prev, [id]: applyGrade(cur, g) };
      });
      setStreak(bumpStreak());
      setSessionCount((c) => c + 1);
      pushRecent(id);

      // Slight delay so the user briefly sees the result before the next card.
      setTimeout(() => {
        setStates((latest) => {
          setCurrentCard(pickNext(cards, latest, recentsRef.current));
          return latest;
        });
        setRevealed(false);
      }, ADVANCE_DELAY_MS);
    },
    [cards, currentCard, pushRecent]
  );

  const skipNext = useCallback(() => {
    if (!currentCard) return;
    pushRecent(currentCard.id);
    setCurrentCard(pickNext(cards, states, recentsRef.current));
    setRevealed(false);
  }, [cards, currentCard, states, pushRecent]);

  const resetAll = useCallback(() => {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    resetStates();
    setStates({});
    setSessionCount(0);
    recentsRef.current = [];
    setCurrentCard(pickNext(cards, {}, []));
    setRevealed(false);
  }, [cards]);

  const onKey = useCallback(
    (e) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (!revealed) setRevealed(true);
        return;
      }
      if (!revealed) return;
      if (e.key === "1") grade(GRADES.AGAIN);
      else if (e.key === "2") grade(GRADES.GOOD);
      else if (e.key === "3") grade(GRADES.EASY);
      else if (e.key.toLowerCase() === "s") skipNext();
    },
    [revealed, grade, skipNext]
  );

  useKeyboardShortcuts(onKey);

  if (!currentCard) return null;

  const cardState = states[currentCard.id] || defaultState(currentCard.id);
  const mastery = masteryLevel(cardState);

  return (
    <div className="min-h-screen w-full bg-stone-50 font-serif">
      <div className="max-w-2xl mx-auto px-4 py-5 sm:py-8">
        <Header
          streakCount={streak.count}
          statsOpen={showStats}
          onToggleStats={() => setShowStats((s) => !s)}
        />

        <DeckSwitcher activeKey={deckKey} onChange={setDeckKey} />

        {showStats ? (
          <StatsPanel stats={stats} sessionCount={sessionCount} onReset={resetAll} />
        ) : (
          <MasteryBar stats={stats} />
        )}

        <Flashcard
          card={currentCard}
          mastery={mastery}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onGrade={grade}
          animationKey={`${deckKey}-${currentCard.id}-${cardState.reps}`}
        />

        <nav className="mt-4 flex items-center justify-center gap-2 font-sans">
          <button
            type="button"
            onClick={skipNext}
            className="flex items-center gap-1.5 px-4 py-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors"
            aria-label="Skip to next card (shortcut: S)"
          >
            <ChevronRight size={15} /> Skip
          </button>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-500">
            <span className="text-stone-800 font-bold tabular-nums">{stats.due}</span> due ·{" "}
            <span className="text-stone-800 font-bold tabular-nums">{stats.new}</span> new
          </span>
        </nav>

        <footer className="mt-6 text-center text-[10px] text-stone-400 font-sans uppercase tracking-widest">
          {deck.label} · {stats.total} cards · Space reveals · 1/2/3 grade · S skip
        </footer>
      </div>
    </div>
  );
}
