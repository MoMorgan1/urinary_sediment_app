import { useState, useEffect, useMemo, useRef } from "react";
import {
  Eye, ChevronLeft, ChevronRight, Layers, FlaskConical, Microscope,
  Flame, RotateCcw, BarChart3, X, Check, Sparkles, Trash2,
} from "lucide-react";
import { DECKS } from "./cards.js";
import {
  defaultState, applyGrade, pickNext, masteryLevel, deckStats,
  loadStates, saveStates, resetStates, loadStreak, bumpStreak,
} from "./srs.js";

const PH_STYLES = {
  acid:     { label: "ACID",     bg: "bg-amber-100", text: "text-amber-900", ring: "ring-amber-400", dot: "bg-amber-500" },
  alkaline: { label: "ALKALINE", bg: "bg-sky-100",   text: "text-sky-900",   ring: "ring-sky-400",   dot: "bg-sky-500" },
  any:      { label: "ANY pH",   bg: "bg-stone-200", text: "text-stone-800", ring: "ring-stone-400", dot: "bg-stone-500" },
};

const MASTERY_COLORS = ["bg-stone-300", "bg-amber-400", "bg-sky-500", "bg-emerald-500"];
const MASTERY_LABELS = ["New", "Learning", "Young", "Mature"];

const DECK_ICONS = { all: Layers, crystals: FlaskConical, organized: Microscope };

export default function App() {
  const [deckKey, setDeckKey] = useState("all");
  const [states, setStates] = useState(() => loadStates());
  const [streak, setStreak] = useState(() => loadStreak());
  const [showStats, setShowStats] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const lastIdRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(null);

  const deck = DECKS[deckKey];
  const cards = deck.cards;

  // Pick first card
  useEffect(() => {
    setCurrentCard(pickNext(cards, states, lastIdRef.current));
    setRevealed(false);
  }, [deckKey]); // eslint-disable-line

  // Persist states
  useEffect(() => { saveStates(states); }, [states]);

  const stats = useMemo(() => deckStats(cards, states), [cards, states]);

  if (!currentCard) return null;

  const cardState = states[currentCard.id] || defaultState(currentCard.id);
  const mastery = masteryLevel(cardState);
  const phStyle = currentCard.ph ? PH_STYLES[currentCard.ph] : null;

  const grade = (g) => {
    setStates(prev => {
      const cur = prev[currentCard.id] || defaultState(currentCard.id);
      return { ...prev, [currentCard.id]: applyGrade(cur, g) };
    });
    setStreak(bumpStreak());
    setSessionCount(c => c + 1);
    lastIdRef.current = currentCard.id;
    setTimeout(() => {
      setStates(latest => {
        setCurrentCard(pickNext(cards, latest, lastIdRef.current));
        return latest;
      });
      setRevealed(false);
    }, 180);
  };

  const skipNext = () => {
    setCurrentCard(pickNext(cards, states, currentCard.id));
    setRevealed(false);
    lastIdRef.current = currentCard.id;
  };

  const resetAll = () => {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    resetStates();
    setStates({});
    setSessionCount(0);
    setCurrentCard(pickNext(cards, {}, null));
    setRevealed(false);
  };

  return (
    <div className="min-h-screen w-full bg-stone-50" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-5 sm:py-8">

        {/* Header */}
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-none">
              Urinary Sediment
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans tracking-wide uppercase">
              Adaptive Practice · SRS
            </p>
          </div>
          <div className="flex items-center gap-2 font-sans">
            {streak.count > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                <Flame size={13} className="fill-orange-500 text-orange-500" />
                <span className="tabular-nums">{streak.count}</span>
              </div>
            )}
            <button
              onClick={() => setShowStats(s => !s)}
              className={`p-2 rounded-lg transition-colors ${showStats ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-700 hover:bg-stone-300"}`}
              title="Stats"
            >
              <BarChart3 size={16} />
            </button>
          </div>
        </header>

        {/* Deck switcher */}
        <div className="mb-4 grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl font-sans">
          {Object.entries(DECKS).map(([key, d]) => {
            const Icon = DECK_ICONS[key];
            const active = deckKey === key;
            return (
              <button
                key={key}
                onClick={() => setDeckKey(key)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${active ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
              >
                <Icon size={14} />
                {d.label}
                <span className="text-stone-400 text-[10px] tabular-nums">({d.cards.length})</span>
              </button>
            );
          })}
        </div>

        {/* Stats panel */}
        {showStats && (
          <div className="mb-4 bg-white rounded-2xl ring-1 ring-stone-200 p-4 sm:p-5 animate-fadeIn font-sans">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-stone-500" />
                <span className="text-xs uppercase tracking-widest font-bold text-stone-700">Mastery</span>
              </div>
              <span className="text-2xl font-bold text-stone-900 tabular-nums">{stats.masteryPct}<span className="text-stone-400 text-base">%</span></span>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden flex mb-3">
              {stats.mature > 0 && <div className="bg-emerald-500" style={{ width: `${(stats.mature / stats.total) * 100}%` }} />}
              {stats.young > 0 && <div className="bg-sky-500" style={{ width: `${(stats.young / stats.total) * 100}%` }} />}
              {stats.learning > 0 && <div className="bg-amber-400" style={{ width: `${(stats.learning / stats.total) * 100}%` }} />}
              {stats.new > 0 && <div className="bg-stone-300" style={{ width: `${(stats.new / stats.total) * 100}%` }} />}
            </div>
            <div className="grid grid-cols-4 gap-2 text-[11px]">
              <StatPill color="bg-emerald-500" label="Mature" value={stats.mature} />
              <StatPill color="bg-sky-500"     label="Young"  value={stats.young} />
              <StatPill color="bg-amber-400"   label="Learn"  value={stats.learning} />
              <StatPill color="bg-stone-300"   label="New"    value={stats.new} />
            </div>
            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Session: <span className="text-stone-800 font-semibold tabular-nums">{sessionCount}</span> reviews</span>
              <span>Lapses: <span className="text-stone-800 font-semibold tabular-nums">{stats.lapses}</span></span>
              <button onClick={resetAll} className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold">
                <Trash2 size={12} /> Reset
              </button>
            </div>
          </div>
        )}

        {/* Mastery bar (always visible, slim) */}
        {!showStats && (
          <div className="mb-4 flex items-center gap-2.5 font-sans">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Mastery</span>
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.mature / stats.total) * 100}%` }} />
              <div className="bg-sky-500 transition-all"     style={{ width: `${(stats.young / stats.total) * 100}%` }} />
              <div className="bg-amber-400 transition-all"   style={{ width: `${(stats.learning / stats.total) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-stone-700 tabular-nums">{stats.masteryPct}%</span>
          </div>
        )}

        {/* Card */}
        <div key={`${deckKey}-${currentCard.id}-${cardState.reps}`} className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 ring-1 ring-stone-200 overflow-hidden animate-fadeIn">
          <div className="relative bg-stone-900 aspect-[16/10] flex items-center justify-center">
            <img src={`/img/${currentCard.slug}.jpg`} alt="Microscopy" className="w-full h-full object-contain" />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-mono uppercase tracking-widest rounded">
              Microscopy
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur rounded font-sans">
              <span className={`w-1.5 h-1.5 rounded-full ${MASTERY_COLORS[mastery]}`} />
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">{MASTERY_LABELS[mastery]}</span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-5 bg-stone-900 hover:bg-stone-700 text-white rounded-xl font-sans text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <Eye size={18} /> Tap to reveal
              </button>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">{currentCard.name}</h2>
                  {phStyle && (
                    <div className={`shrink-0 px-3 py-1.5 rounded-full ${phStyle.bg} ${phStyle.text} ring-1 ${phStyle.ring} font-sans text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${phStyle.dot}`} />
                      {phStyle.label}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold mb-1.5">Interpretation</div>
                  <p className="text-stone-700 text-base sm:text-lg leading-relaxed">{currentCard.interp}</p>
                </div>

                {/* SRS grade buttons */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 font-sans">
                  <button onClick={() => grade(0)} className="py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-rose-200">
                    <X size={16} />
                    <span className="text-[11px] mt-0.5">Again</span>
                  </button>
                  <button onClick={() => grade(3)} className="py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-sky-200">
                    <Check size={16} />
                    <span className="text-[11px] mt-0.5">Good</span>
                  </button>
                  <button onClick={() => grade(5)} className="py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-emerald-200">
                    <Sparkles size={16} />
                    <span className="text-[11px] mt-0.5">Easy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-4 flex items-center justify-center gap-2 font-sans">
          <button onClick={skipNext} className="flex items-center gap-1.5 px-4 py-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors">
            <ChevronRight size={15} /> Skip
          </button>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-500 font-sans">
            <span className="text-stone-800 font-bold tabular-nums">{stats.due}</span> due ·{" "}
            <span className="text-stone-800 font-bold tabular-nums">{stats.new}</span> new
          </span>
        </div>

        <div className="mt-6 text-center text-[10px] text-stone-400 font-sans uppercase tracking-widest">
          {deck.label} · {stats.total} cards
        </div>

      </div>
    </div>
  );
}

function StatPill({ color, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center bg-stone-50 rounded-lg p-2">
      <span className={`w-2 h-2 rounded-full ${color} mb-1`} />
      <span className="font-bold text-stone-900 tabular-nums">{value}</span>
      <span className="text-stone-500 text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
