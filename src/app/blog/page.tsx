import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export const metadata = {
  title: 'Blog | Meu Blog Pessoal',
  description: 'Artigos e tutoriais sobre programação e tecnologia',
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      created_at,
      category:categories(id, name, slug),
      tags:post_tags(tag:tags(id, name, slug))
    `
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  // Transform tags from nested structure
  const transformedPosts: Post[] =
    posts?.map((post: any) => ({
      ...post,
      tags: post.tags?.map((t: any) => t.tag) || [],
    })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-gray-600">
          Artigos e tutoriais sobre programação e tecnologia
        </p>
      </div>

      {transformedPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum post publicado ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformedPosts.map((post) => (
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
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="info">{post.category.name}</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
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
