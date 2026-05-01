import { Sparkles, Trash2 } from "lucide-react";

function StatPill({ color, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center bg-stone-50 rounded-lg p-2">
      <span className={`w-2 h-2 rounded-full ${color} mb-1`} />
      <span className="font-bold text-stone-900 tabular-nums">{value}</span>
      <span className="text-stone-500 text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function StatsPanel({ stats, sessionCount, onReset }) {
  const pct = (n) => (stats.total === 0 ? 0 : (n / stats.total) * 100);

  return (
    <div className="mb-4 bg-white rounded-2xl ring-1 ring-stone-200 p-4 sm:p-5 animate-fadeIn font-sans">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-stone-500" />
          <span className="text-xs uppercase tracking-widest font-bold text-stone-700">
            Mastery
          </span>
        </div>
        <span className="text-2xl font-bold text-stone-900 tabular-nums">
          {stats.masteryPct}
          <span className="text-stone-400 text-base">%</span>
        </span>
      </div>

      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden flex mb-3">
        {stats.mature > 0 && (
          <div className="bg-emerald-500" style={{ width: `${pct(stats.mature)}%` }} />
        )}
        {stats.young > 0 && (
          <div className="bg-sky-500" style={{ width: `${pct(stats.young)}%` }} />
        )}
        {stats.learning > 0 && (
          <div className="bg-amber-400" style={{ width: `${pct(stats.learning)}%` }} />
        )}
        {stats.new > 0 && (
          <div className="bg-stone-300" style={{ width: `${pct(stats.new)}%` }} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 text-[11px]">
        <StatPill color="bg-emerald-500" label="Mature" value={stats.mature} />
        <StatPill color="bg-sky-500" label="Young" value={stats.young} />
        <StatPill color="bg-amber-400" label="Learn" value={stats.learning} />
        <StatPill color="bg-stone-300" label="New" value={stats.new} />
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>
          Session:{" "}
          <span className="text-stone-800 font-semibold tabular-nums">{sessionCount}</span>{" "}
          reviews
        </span>
        <span>
          Lapses:{" "}
          <span className="text-stone-800 font-semibold tabular-nums">{stats.lapses}</span>
        </span>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold"
        >
          <Trash2 size={12} /> Reset
        </button>
      </div>
    </div>
  );
}

export function MasteryBar({ stats }) {
  const pct = (n) => (stats.total === 0 ? 0 : (n / stats.total) * 100);
  return (
    <div className="mb-4 flex items-center gap-2.5 font-sans">
      <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
        Mastery
      </span>
      <div
        className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden flex"
        role="progressbar"
        aria-valuenow={stats.masteryPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="bg-emerald-500 transition-all" style={{ width: `${pct(stats.mature)}%` }} />
        <div className="bg-sky-500 transition-all" style={{ width: `${pct(stats.young)}%` }} />
        <div className="bg-amber-400 transition-all" style={{ width: `${pct(stats.learning)}%` }} />
      </div>
      <span className="text-xs font-bold text-stone-700 tabular-nums">{stats.masteryPct}%</span>
    </div>
  );
}
