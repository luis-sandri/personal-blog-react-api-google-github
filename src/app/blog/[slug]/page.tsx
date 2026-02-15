import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';
import { Comments } from '@/components/Comments';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image,
      created_at,
      updated_at,
      category:categories(id, name, slug),
      tags:post_tags(tag:tags(id, name, slug))
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
.single();

  if (!post) {
    notFound();
  }

  // Type assertion for category (Supabase returns object for many-to-one)
  const category = post.category as any as { id: string; name: string; slug: string } | null;
  const tags = post.tags?.map((t: any) => t.tag) || [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{post.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {category && <Badge variant="info">{category.name}</Badge>}
          <time className="text-sm text-gray-600">
            {formatDate(post.created_at)}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600">{post.excerpt}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag: any) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                  {tag.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.featured_image && (
        <div className="mb-10">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para o blog
          </Link>

          <Link
            href={`/blog/categoria/${post.category.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver mais em {post.category.name} →
          </Link>
        </div>
      </footer>

      {/* Comments section */}
      <Comments postId={post.id} />
    </article>
  );
}
