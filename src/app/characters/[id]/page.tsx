'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacter } from '@/lib/api';
import { useFavorites } from '@/lib/favorites';
import { z } from 'zod';

const noteSchema = z.object({ note: z.string().max(200, 'Max 200 chars').optional() });

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isFav, toggle } = useFavorites();
  const fav = isFav(Number(id));

  const q = useQuery({
    queryKey: ['character', id],
    queryFn: ({ signal }) => fetchCharacter(id, signal),
  });

  if (q.isPending) return <div className="p-6">Loading…</div>;
  if (q.isError)
    return (
      <div className="p-6">
        <p className="mb-4">Failed to load character.</p>
        <button onClick={() => router.back()} className="rounded-xl border px-3 py-2">
          Go back
        </button>
      </div>
    );

  const c = q.data;

  return (
    <main className="mx-auto max-w-3xl p-4 space-y-4">
      <Link href="/" className="text-sm underline">
        ← Back to list
      </Link>

      <article className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt="" className="w-full aspect-square object-cover" />
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{c.name}</h1>
            <button
              onClick={() => toggle(c.id)}
              className="text-2xl"
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              title={fav ? 'Unfavorite' : 'Favorite'}
            >
              {fav ? '★' : '☆'}
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {c.status} · {c.species} · {c.gender}
          </p>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="font-medium">Origin</dt>
              <dd>{c.origin.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Last seen</dt>
              <dd>{c.location.name}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-medium">Episodes</dt>
              <dd>{c.episode.length}</dd>
            </div>
          </dl>
        </div>
      </article>

      <NoteForm id={String(c.id)} />
    </main>
  );
}

function NoteForm({ id }: { id: string }) {
  const key = `note:${id}`;
  const saved = (typeof window !== 'undefined' && localStorage.getItem(key)) || '';
  const handleSubmit = (formData: FormData) => {
    const note = String(formData.get('note') || '');
    const parsed = noteSchema.safeParse({ note });
    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }
    localStorage.setItem(key, parsed.data.note || '');
    alert('Saved');
  };
  return (
    <form action={handleSubmit} className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium">Your note</span>
        <textarea
          name="note"
          defaultValue={saved}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white/70 p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          rows={3}
          placeholder="Add a short note (local only)"
        />
      </label>
      <button className="rounded-xl border px-3 py-2">Save note</button>
    </form>
  );
}
