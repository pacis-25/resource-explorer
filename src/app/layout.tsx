import './globals.css';
import { ReactNode } from 'react';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Resource Explorer',
  description: 'Explore Rick & Morty resources with great UX.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
