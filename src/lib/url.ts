export type Filters = {
  page?: number; q?: string;
  status?: 'Alive'|'Dead'|'unknown'|'all';
  species?: string;
  sort?: 'id-asc'|'id-desc'|'name-asc'|'name-desc';
  favorites?: 'only'|'all';
};

export function paramsToFilters(sp: URLSearchParams): Filters {
  return {
    page: Number(sp.get('page') ?? '1') || 1,
    q: sp.get('q') ?? undefined,
    status: (sp.get('status') as Filters['status']) || 'all',
    species: sp.get('species') ?? undefined,
    sort: (sp.get('sort') as Filters['sort']) || 'id-asc',
    favorites: (sp.get('favorites') as Filters['favorites']) || 'all'
  };
}

export function filtersToSearchParams(f: Filters): string {
  const p = new URLSearchParams();
  if (f.page && f.page !== 1) p.set('page', String(f.page));
  if (f.q) p.set('q', f.q);
  if (f.status && f.status !== 'all') p.set('status', f.status);
  if (f.species) p.set('species', f.species);
  if (f.sort && f.sort !== 'id-asc') p.set('sort', f.sort);
  if (f.favorites && f.favorites !== 'all') p.set('favorites', f.favorites);
  return p.toString();
}
