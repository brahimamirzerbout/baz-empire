import { useEffect, useRef, useState } from "react";

/**
 * useDraft - persists a serializable value to localStorage with debounce.
 * Returns [value, setValue, clear] where value is initialized from storage.
 */
export function useDraft<T extends Record<string, unknown>>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValueState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      return { ...initial, ...(parsed as Partial<T>) };
    } catch {
      return initial;
    }
  });

  const timer = useRef<number | null>(null);

  const setValue = (next: T | ((prev: T) => T)) => {
    setValueState((prev) => {
      const computed = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      // Debounced write to localStorage
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(computed));
        } catch {
          // ignore quota / private mode
        }
      }, 500);
      return computed;
    });
  };

  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValueState(initial);
  };

  // Persist final value on unmount
  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  return [value, setValue, clear];
}
