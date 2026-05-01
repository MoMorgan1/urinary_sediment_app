import { useState, useEffect } from "react";
import { Eye, X, Check, Sparkles } from "lucide-react";
import {
  PH_STYLES,
  MASTERY_COLORS,
  MASTERY_LABELS,
  GRADES,
} from "../constants.js";

function CardImage({ slug, alt }) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [slug]);

  if (errored) {
    return (
      <div className="text-stone-500 text-xs font-mono uppercase tracking-widest text-center px-6">
        Image unavailable
        <div className="text-stone-600 mt-1 normal-case tracking-normal">{slug}</div>
      </div>
    );
  }

  return (
    <img
      src={`/img/${slug}.jpg`}
      alt={alt}
      className="w-full h-full object-contain"
      onError={() => setErrored(true)}
      loading="eager"
      decoding="async"
    />
  );
}

function GradeButtons({ onGrade }) {
  return (
    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 font-sans">
      <button
        type="button"
        onClick={() => onGrade(GRADES.AGAIN)}
        aria-label="Grade: Again (shortcut 1)"
        className="py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-rose-200"
      >
        <X size={16} />
        <span className="text-[11px] mt-0.5">Again</span>
      </button>
      <button
        type="button"
        onClick={() => onGrade(GRADES.GOOD)}
        aria-label="Grade: Good (shortcut 2)"
        className="py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-sky-200"
      >
        <Check size={16} />
        <span className="text-[11px] mt-0.5">Good</span>
      </button>
      <button
        type="button"
        onClick={() => onGrade(GRADES.EASY)}
        aria-label="Grade: Easy (shortcut 3)"
        className="py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-colors active:scale-[0.98] ring-1 ring-emerald-200"
      >
        <Sparkles size={16} />
        <span className="text-[11px] mt-0.5">Easy</span>
      </button>
    </div>
  );
}

export function Flashcard({ card, mastery, revealed, onReveal, onGrade, animationKey }) {
  const phStyle = card.ph ? PH_STYLES[card.ph] : null;

  return (
    <div
      key={animationKey}
      className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 ring-1 ring-stone-200 overflow-hidden animate-fadeIn"
    >
      <div className="relative bg-stone-900 aspect-[16/10] flex items-center justify-center">
        <CardImage
          slug={card.slug}
          alt={revealed ? `Microscopy specimen: ${card.name}` : "Microscopy specimen — answer hidden"}
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-mono uppercase tracking-widest rounded">
          Microscopy
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur rounded font-sans">
          <span className={`w-1.5 h-1.5 rounded-full ${MASTERY_COLORS[mastery]}`} />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">
            {MASTERY_LABELS[mastery]}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {!revealed ? (
          <button
            type="button"
            onClick={onReveal}
            aria-expanded={false}
            aria-label="Reveal answer (shortcut: Space)"
            className="w-full py-5 bg-stone-900 hover:bg-stone-700 text-white rounded-xl font-sans text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
          >
            <Eye size={18} /> Tap to reveal
          </button>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {card.name}
              </h2>
              {phStyle && (
                <div
                  className={`shrink-0 px-3 py-1.5 rounded-full ${phStyle.bg} ${phStyle.text} ring-1 ${phStyle.ring} font-sans text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${phStyle.dot}`} />
                  {phStyle.label}
                </div>
              )}
            </div>

            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold mb-1.5">
                Interpretation
              </div>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                {card.interp}
              </p>
            </div>

            <GradeButtons onGrade={onGrade} />
          </div>
        )}
      </div>
    </div>
  );
}
