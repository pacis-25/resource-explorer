export type Character = {
  id: number; name: string; status: 'Alive'|'Dead'|'unknown';
  species: string; type: string; gender: 'Female'|'Male'|'Genderless'|'unknown';
  image: string; origin: { name: string }; location: { name: string }; episode: string[];
};
export type Paged<T> = { info: { count: number; pages: number; next: string|null; prev: string|null }; results: T[]; };

const BASE = 'https://rickandmortyapi.com/api';

export async function fetchCharacters(
  { page=1, q, status, species, sort }:
  { page?: number; q?: string; status?: Character['status']|'all'; species?: string; sort?: 'id-asc'|'id-desc'|'name-asc'|'name-desc' },
  signal?: AbortSignal
): Promise<Paged<Character>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (q) params.set('name', q);
  if (status && status !== 'all') params.set('status', status);
  if (species) params.set('species', species);
  const res = await fetch(`${BASE}/character?${params}`, { signal });
  if (!res.ok) {
    if (res.status === 404) return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    throw new Error(`Failed (${res.status})`);
  }
  const data = await res.json() as Paged<Character>;
  if (sort) {
    const [key, dir] = sort.split('-') as ['id'|'name','asc'|'desc'];
    data.results.sort((a,b) => {
      const va = a[key] as any, vb = b[key] as any;
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return dir === 'asc' ? cmp : -cmp;
    });
  }
  return data;
}

export async function fetchCharacter(id: string, signal?: AbortSignal): Promise<Character> {
  const res = await fetch(`${BASE}/character/${id}`, { signal });
  if (!res.ok) throw new Error(`Failed (${res.status})`);
  return res.json();
}
