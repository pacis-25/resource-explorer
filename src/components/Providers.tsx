'use client';
import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/theme';
import { FavoritesProvider } from '@/lib/favorites';

export default function Providers({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1m
            gcTime: 300_000,   // 5m
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
