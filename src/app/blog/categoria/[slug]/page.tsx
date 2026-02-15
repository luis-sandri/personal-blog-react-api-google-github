import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!category) {
    return { title: 'Categoria não encontrada' };
  }

  return {
    title: `${category.name} | Blog`,
    description: category.description || `Posts sobre ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      created_at
    `
    )
    .eq('category_id', category.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Voltar para o blog
        </Link>
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-gray-600">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">
            Nenhum post nesta categoria ainda.
          </p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                {post.featured_image && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
