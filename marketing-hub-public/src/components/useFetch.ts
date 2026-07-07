// Tiny client-side data hook to keep page code DRY.
"use client";
import { useEffect, useCallback, useRef, useState } from "react";
import { useToast } from "./Toast";

export function useFetch<T = Record<string, unknown>>(
  url: string | null,
  opts?: { silent?: boolean },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const silent = opts?.silent ?? false;
  const firstLoad = useRef(true);

  const reload = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: T = await res.json();
      setData(json);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      if (!silent && !firstLoad.current) {
        toast.error("Couldn't load data", msg);
      }
    } finally {
      setLoading(false);
      firstLoad.current = false;
    }
  }, [url, silent, toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}

export async function apiFetch(url: string, opts: RequestInit = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as { error?: string };
      msg = j.error || msg;
    } catch {
      // response not JSON
    }
    throw new Error(msg);
  }
  return res.json();
}
