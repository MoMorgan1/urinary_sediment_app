import { useEffect } from "react";

/**
 * Bind a keydown handler to window with sensible defaults:
 * ignores keys when the user is typing in an input, modifier-keyed combos,
 * and repeat events. The handler receives the original KeyboardEvent.
 *
 * @param {(e: KeyboardEvent) => void} handler
 * @param {{enabled?: boolean}} [options]
 */
export function useKeyboardShortcuts(handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (e) => {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      handler(e);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handler, enabled]);
}
