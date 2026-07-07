"use client";
import { useEffect, useState } from "react";

/**
 * TypewriterText — multi-string rotating typewriter.
 * Replaces the typewriter-effect dependency with a simple inline implementation.
 */
export type TypewriterTextProps = {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  className?: string;
  pause?: boolean;
};

export function TypewriterText({
  strings,
  typeSpeed = 70,
  deleteSpeed = 40,
  delaySpeed = 1500,
  className,
  pause = false,
}: TypewriterTextProps) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (pause || strings.length === 0) return;
    const current = strings[idx % strings.length];
    let timeout: number;

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), delaySpeed);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx((i) => i + 1);
    } else {
      timeout = window.setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
          );
        },
        deleting ? deleteSpeed : typeSpeed,
      );
    }

    return () => window.clearTimeout(timeout);
  }, [text, deleting, idx, strings, typeSpeed, deleteSpeed, delaySpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default TypewriterText;
