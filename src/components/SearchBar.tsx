'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { filtersToSearchParams, paramsToFilters } from '@/lib/url';

export default function SearchBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => paramsToFilters(sp), [sp]);
  const [value, setValue] = useState(filters.q ?? '');

  // Sync input if URL changes via back/forward
  useEffect(() => setValue(filters.q ?? ''), [filters.q]);

  // Debounce URL update
  useEffect(() => {
    const id = setTimeout(() => {
      const next = { ...filters, q: value || undefined, page: 1 };
      const qs = filtersToSearchParams(next);
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    }, 400);
    return () => clearTimeout(id);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <label className="block">
      <span className="sr-only">Search by name</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name…"
        className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="Search characters by name"
      />
    </label>
  );
}
