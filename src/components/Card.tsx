'use client';
import Link from 'next/link';
import { Character } from '@/lib/api';
import { useFavorites } from '@/lib/favorites';

export default function Card({ c }: { c: Character }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(c.id);

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/60 dark:bg-slate-900 hover:shadow">
      <Link href={`/characters/${c.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt="" className="w-full aspect-square object-cover" />
      </Link>
      <div className="p-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-tight">
            <Link href={`/characters/${c.id}`}>{c.name}</Link>
          </h3>
          <p className="text-xs text-slate-500">
            {c.status} · {c.species}
          </p>
        </div>
        <button
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggle(c.id)}
          className={`text-xl ${fav ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
          title={fav ? 'Unfavorite' : 'Favorite'}
        >
          {fav ? '★' : '☆'}
        </button>
      </div>
    </article>
  );
}
