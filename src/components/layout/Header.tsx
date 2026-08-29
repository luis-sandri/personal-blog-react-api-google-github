'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const links = [{ href: '/blog', label: 'Artigos' }, { href: '/projetos', label: 'Projetos' }, { href: '/sobre', label: 'Sobre' }, { href: '/contato', label: 'Contato' }];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b bg-[color:var(--color-bg)]/95 backdrop-blur"><div className="site-container flex h-16 items-center justify-between"><Link href="/" className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">Luís <span className="text-[var(--color-primary)]">Sandri</span></Link><nav className="hidden items-center gap-6 md:flex" aria-label="Navegação principal">{links.map(link => <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-[var(--color-primary)]">{link.label}</Link>)}<ThemeToggle /></nav><div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button aria-label="Abrir menu" onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-md border">{open ? <X size={18}/> : <Menu size={18}/>}</button></div></div>{open && <nav className="site-container flex flex-col gap-4 border-t py-5 md:hidden" aria-label="Navegação mobile">{links.map(link => <Link key={link.href} onClick={() => setOpen(false)} href={link.href} className="font-medium">{link.label}</Link>)}</nav>}</header>;
}
