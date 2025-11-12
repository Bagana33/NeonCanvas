import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Flags {
  gpt5Enabled: boolean;
  aiModel: string;
  updatedAt?: string;
}

interface FlagsContextValue {
  flags: Flags;
  loading: boolean;
  error: Error | null;
}

const FlagsContext = createContext<FlagsContextValue | undefined>(undefined);

const CACHE_KEY = 'neon_flags_v1';
const DEFAULT_FLAGS: Flags = { gpt5Enabled: false, aiModel: 'gpt-4o' };

export function FlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Flags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFlags() {
      try {
        // Try cached first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setFlags(parsed);
        }

        // Fetch fresh flags
        const res = await fetch('/flags.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Flags fetch failed: ${res.status}`);
        const json = await res.json();

        const updated: Flags = {
          gpt5Enabled: !!json.gpt5Enabled,
          aiModel: json.aiModel || 'gpt-5',
          updatedAt: json.updatedAt,
        };

        setFlags(updated);
        localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        setError(null);
      } catch (err) {
        console.warn('[FlagsContext] Failed to load flags.json, using cache/fallback', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Already set from cache or default
      } finally {
        setLoading(false);
      }
    }

    loadFlags();
  }, []);

  return (
    <FlagsContext.Provider value={{ flags, loading, error }}>
      {children}
    </FlagsContext.Provider>
  );
}

export function useFlags() {
  const ctx = useContext(FlagsContext);
  if (!ctx) throw new Error('useFlags must be used within FlagsProvider');
  return ctx;
}
