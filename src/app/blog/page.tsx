import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';

interface Post { id: string; title: string; slug: string; excerpt: string | null; featured_image: string | null; created_at: string; category: { id: string; name: string; slug: string } | null; tags: { id: string; name: string; slug: string }[]; }
export const metadata = { title: 'Artigos', description: 'Artigos sobre Engenharia de Software, cloud, IA e carreira.' };

export default async function BlogPage() {
  let posts: any[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const response = await supabase.from('posts').select('id, title, slug, excerpt, featured_image, created_at, category:categories(id, name, slug), tags:post_tags(tag:tags(id, name, slug))').eq('status', 'published').order('created_at', { ascending: false }).limit(20);
      posts = response.data || [];
    } catch {
      posts = [];
    }
  }
  const transformedPosts: Post[] = posts.map((post: any) => ({ ...post, category: Array.isArray(post.category) ? post.category[0] || null : post.category, tags: (post.tags || []).map((item: any) => item.tag).filter(Boolean) }));

  return <div className="site-container py-16 sm:py-24"><div className="mb-14 max-w-3xl"><p className="tech-label text-[var(--color-primary)]">knowledge / all posts</p><h1 className="mt-4 text-5xl font-bold sm:text-6xl">Artigos para construir com mais clareza.</h1><p className="mt-6 text-lg leading-8 text-[var(--color-text-muted)]">Aprendizados sobre Engenharia de Software, cloud, IA e os bastidores de construir uma carreira em tecnologia.</p></div>{transformedPosts.length === 0 ? <Card className="border bg-[var(--color-surface)] p-12 text-center shadow-none"><p className="font-mono-tech text-sm text-[var(--color-text-muted)]">status: nenhum artigo publicado ainda</p></Card> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{transformedPosts.map(post => <Link key={post.id} href={`/blog/${post.slug}`} className="group"><Card className="h-full overflow-hidden border bg-[var(--color-surface)] shadow-none transition-transform hover:-translate-y-0.5">{post.featured_image && <div className="aspect-video w-full overflow-hidden bg-[var(--color-graphite)]"><img src={post.featured_image} alt={post.title} className="h-full w-full object-cover" /></div>}<div className="p-6"><div className="mb-8 flex items-center gap-2"><Badge variant="info">{post.category?.name || 'artigo'}</Badge><span className="font-mono-tech text-xs text-[var(--color-text-muted)]">{formatDate(post.created_at)}</span></div><h2 className="mb-3 text-2xl font-bold leading-tight line-clamp-2">{post.title}</h2>{post.excerpt && <p className="mb-6 line-clamp-3 leading-7 text-[var(--color-text-muted)]">{post.excerpt}</p>}{post.tags.length > 0 && <div className="flex flex-wrap gap-x-3 gap-y-1">{post.tags.map(tag => <span key={tag.id} className="font-mono-tech text-[.68rem] text-[var(--color-text-muted)]">#{tag.name}</span>)}</div>}<span className="arrow-link mt-7 inline-block font-medium">Ler artigo <span className="arrow">→</span></span></div></Card></Link>)}</div>}</div>;
}
