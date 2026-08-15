"use client";

// Local-only progress tracking. Swap for a real API (POST /api/progress) once
// the backend has a table to persist this — see handoff/README.md.

type KnownMap = Record<number, boolean>; // termId -> known?
type FavMap = Record<number, boolean>;

const KNOWN_KEY = "prolingo:known";
const FAV_KEY = "prolingo:favorites";
const ACTIVE_DAYS_KEY = "prolingo:activeDays";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(val));
}

export function getKnownMap(): KnownMap {
  return read<KnownMap>(KNOWN_KEY, {});
}

export function setKnown(termId: number, known: boolean) {
  const map = getKnownMap();
  map[termId] = known;
  write(KNOWN_KEY, map);
}

export function getFavorites(): FavMap {
  return read<FavMap>(FAV_KEY, {});
}

export function toggleFavorite(termId: number) {
  const map = getFavorites();
  map[termId] = !map[termId];
  write(FAV_KEY, map);
  return map[termId];
}

// Cumulative count of distinct calendar days the user has studied — not a streak,
// so a missed day doesn't reset it.
export function bumpActiveDays(): number {
  const today = new Date().toISOString().slice(0, 10);
  const days = read<string[]>(ACTIVE_DAYS_KEY, []);
  if (!days.includes(today)) {
    days.push(today);
    write(ACTIVE_DAYS_KEY, days);
  }
  return days.length;
}

export function getActiveDays(): number {
  return read<string[]>(ACTIVE_DAYS_KEY, []).length;
}
