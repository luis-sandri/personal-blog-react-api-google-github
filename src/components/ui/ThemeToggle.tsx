'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)); }, []);
  const toggle = () => { const next = !dark; document.documentElement.dataset.theme = next ? 'dark' : 'light'; localStorage.setItem('theme', next ? 'dark' : 'light'); setDark(next); };
  return <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-md border border-[var(--color-border)] text-[var(--color-text)]" aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>;
}
