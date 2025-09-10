import SearchBar from '@/components/SearchBar';
import Filters from '@/components/Filters';
import List from '@/components/List';
import NavBar from '@/components/NavBar';

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <NavBar />
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Resource Explorer</h1>
      </header>
      <SearchBar />
      <Filters />
      <List />
    </main>
  );
}
