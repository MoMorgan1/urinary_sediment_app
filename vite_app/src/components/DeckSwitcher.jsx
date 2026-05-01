import { DECKS } from "../cards.js";
import { DECK_ICONS } from "../constants.js";

export function DeckSwitcher({ activeKey, onChange }) {
  return (
    <div
      className="mb-4 grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl font-sans"
      role="tablist"
      aria-label="Choose deck"
    >
      {Object.entries(DECKS).map(([key, deck]) => {
        const Icon = DECK_ICONS[key];
        const active = activeKey === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              active
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Icon size={14} />
            {deck.label}
            <span className="text-stone-400 text-[10px] tabular-nums">
              ({deck.cards.length})
            </span>
          </button>
        );
      })}
    </div>
  );
}
