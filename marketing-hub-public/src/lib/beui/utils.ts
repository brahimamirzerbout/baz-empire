import { clsx, type ClassValue } from "clsx";

/**
 * cn — class name combiner. Uses clsx directly (we don't ship tailwind-merge
 * to keep our bundle slim; if duplicate-class conflicts matter later, swap
 * in twMerge without touching call sites).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
