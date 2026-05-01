/**
 * Visual style tokens shared across components.
 * Keeping them here lets us iterate on the design language without
 * touching component logic.
 */

import { Layers, FlaskConical, Microscope } from "lucide-react";

export const PH_STYLES = {
  acid: {
    label: "ACID",
    bg: "bg-amber-100",
    text: "text-amber-900",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
  },
  alkaline: {
    label: "ALKALINE",
    bg: "bg-sky-100",
    text: "text-sky-900",
    ring: "ring-sky-400",
    dot: "bg-sky-500",
  },
  any: {
    label: "ANY pH",
    bg: "bg-stone-200",
    text: "text-stone-800",
    ring: "ring-stone-400",
    dot: "bg-stone-500",
  },
};

export const MASTERY_COLORS = [
  "bg-stone-300",
  "bg-amber-400",
  "bg-sky-500",
  "bg-emerald-500",
];

export const MASTERY_LABELS = ["New", "Learning", "Young", "Mature"];

export const DECK_ICONS = {
  all: Layers,
  crystals: FlaskConical,
  organized: Microscope,
};

/** SM-2 grade values that map to user-facing buttons. */
export const GRADES = Object.freeze({
  AGAIN: 0,
  GOOD: 3,
  EASY: 5,
});
