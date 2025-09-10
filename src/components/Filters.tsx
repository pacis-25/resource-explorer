'use client';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { filtersToSearchParams, paramsToFilters } from '@/lib/url';
import { useTheme } from '@/lib/theme';

export default function Filters() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => paramsToFilters(sp), [sp]);
  const { theme, toggle } = useTheme();

  function set<K extends keyof typeof filters>(key: K, val: (typeof filters)[K]) {
    const next = { ...filters, [key]: val, page: 1 };
    const qs = filtersToSearchParams(next);
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <select
        value={filters.status ?? 'all'}
        onChange={(e) => set('status', e.target.value as any)}
        className="rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="Filter by status"
      >
        <option value="all">All status</option>
        <option>Alive</option>
        <option>Dead</option>
        <option value="unknown">Unknown</option>
      </select>

      <select
        value={filters.sort ?? 'id-asc'}
        onChange={(e) => set('sort', e.target.value as any)}
        className="rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="Sort results"
      >
        <option value="id-asc">ID ↑</option>
        <option value="id-desc">ID ↓</option>
        <option value="name-asc">Name A→Z</option>
        <option value="name-desc">Name Z→A</option>
      </select>

      <select
        value={filters.favorites ?? 'all'}
        onChange={(e) => set('favorites', e.target.value as any)}
        className="rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="Show favorites"
      >
        <option value="all">All</option>
        <option value="only">Favorites only</option>
      </select>

      <button
        onClick={toggle}
        className="rounded-xl border px-3 py-2 text-sm border-slate-300 dark:border-slate-700"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
