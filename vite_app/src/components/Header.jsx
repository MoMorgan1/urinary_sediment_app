import { Flame, BarChart3 } from "lucide-react";

export function Header({ streakCount, statsOpen, onToggleStats }) {
  return (
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
        {streakCount > 0 && (
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold"
            title={`${streakCount}-day streak`}
          >
            <Flame size={13} className="fill-orange-500 text-orange-500" />
            <span className="tabular-nums">{streakCount}</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleStats}
          aria-pressed={statsOpen}
          aria-label="Toggle statistics panel"
          className={`p-2 rounded-lg transition-colors ${
            statsOpen
              ? "bg-stone-900 text-white"
              : "bg-stone-200 text-stone-700 hover:bg-stone-300"
          }`}
        >
          <BarChart3 size={16} />
        </button>
      </div>
    </header>
  );
}
