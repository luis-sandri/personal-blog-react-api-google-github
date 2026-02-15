import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/formatDate';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from('tags')
    .select('name')
    .eq('slug', slug)
    .single();

  if (!tag) {
    return { title: 'Tag não encontrada' };
  }

  return {
    title: `${tag.name} | Blog`,
    description: `Posts com a tag ${tag.name}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!tag) {
    notFound();
  }

  const { data: postTags } = await supabase
    .from('post_tags')
    .select(
      `
      post:posts(
        id,
        title,
        slug,
        excerpt,
        featured_image,
        created_at,
        status
      )
    `
    )
    .eq('tag_id', tag.id);

  const posts =
    postTags
      ?.map((pt: any) => pt.post)
      .filter((post: any) => post.status === 'published') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Voltar para o blog
        </Link>
        <h1 className="text-4xl font-bold mb-4">
          Posts com a tag &quot;{tag.name}&quot;
        </h1>
        <p className="text-sm text-gray-500">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum post com esta tag ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
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
