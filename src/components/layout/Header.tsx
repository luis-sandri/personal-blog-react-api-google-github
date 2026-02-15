'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Blog Pessoal</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Início
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>

            {session ? (
              <UserMenu />
            ) : (
              <Link href="/signin">
                <Button size="sm">Entrar</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
