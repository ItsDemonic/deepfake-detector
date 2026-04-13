import { useState, useEffect } from 'react';
import type { HistoryEntry } from '../types';

const STORAGE_KEY = 'deepguard_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as HistoryEntry[];
      return parsed.map((e) => ({ ...e, timestamp: new Date(e.timestamp) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 50));
    return newEntry;
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, addEntry, clearHistory };
}
