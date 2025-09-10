'use client';
import Link from 'next/link';
import { useFavorites } from '@/lib/favorites';

export default function NavBar() {
  const { count } = useFavorites();
  return (
    <nav className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-2">
      <Link href="/" className="font-semibold">Rick & Morty Explorer</Link>
      <div className="text-sm">★ Favorites: {count}</div>
    </nav>
  );
}
