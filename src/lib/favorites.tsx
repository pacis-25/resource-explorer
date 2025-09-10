'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  PropsWithChildren,
} from 'react';

type FavMap = Record<string, true>;
const KEY = 'favorites:v1';

function read(): FavMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as FavMap;
  } catch {
    return {};
  }
}

type FavoritesContextType = {
  isFav: (id: number) => boolean;
  toggle: (id: number) => void;
  count: number;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [map, setMap] = useState<FavMap>({});

  // load initial
  useEffect(() => { setMap(read()); }, []);

  // persist
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(map)); }, [map]);

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setMap(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id: number) => {
    setMap((m) => {
      const k = String(id);
      const next = { ...m };
      if (next[k]) delete next[k];
      else next[k] = true;
      return next;
    });
  }, []);

  const isFav = useCallback((id: number) => !!map[String(id)], [map]);
  const count = useMemo(() => Object.keys(map).length, [map]);

  const value: FavoritesContextType = { isFav, toggle, count };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within <FavoritesProvider>');
  }
  return ctx;
}
