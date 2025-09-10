'use client';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Character, fetchCharacters } from '@/lib/api';
import { filtersToSearchParams, paramsToFilters } from '@/lib/url';
import { useFavorites } from '@/lib/favorites';
import Card from './Card';

export default function List() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => paramsToFilters(sp), [sp]);
  const { isFav } = useFavorites();

  const q = useQuery({
    queryKey: ['characters', filters] as const,
    queryFn: ({ signal }) => fetchCharacters(filters, signal), // returns Promise<Paged<Character>>
    // v5 replacement for keepPreviousData:
    placeholderData: keepPreviousData,
  });

  // Shape data safely for TS and runtime
  const results = useMemo(() => {
    const base: Character[] = q.data?.results ?? [];
    return filters.favorites === 'only' ? base.filter((c) => isFav(c.id)) : base;
  }, [q.data, filters.favorites, isFav]);

  function setPage(page: number) {
    const qs = filtersToSearchParams({ ...filters, page });
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  if (q.isPending) return <SkeletonGrid />;

  if (q.isError)
    return (
      <div className="text-center p-10">
        <p className="mb-4">Something went wrong.</p>
        <button onClick={() => q.refetch()} className="rounded-xl border px-4 py-2">
          Retry
        </button>
      </div>
    );

  if (!results.length)
    return (
      <div className="text-center p-10">
        <p>No results. Try changing filters or search.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((c) => (
          <Card key={c.id} c={c} />
        ))}
      </div>
      <Pagination page={filters.page ?? 1} pages={q.data?.info.pages ?? 1} onChange={setPage} />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
          <div className="w-full aspect-square bg-slate-200/70 dark:bg-slate-800" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-200/70 dark:bg-slate-800 rounded" />
            <div className="h-3 w-1/2 bg-slate-200/70 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-xl border px-3 py-2 disabled:opacity-40">
        Prev
      </button>
      <span className="text-sm">Page {page} / {Math.max(1, pages)}</span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-xl border px-3 py-2 disabled:opacity-40">
        Next
      </button>
    </div>
  );
}
