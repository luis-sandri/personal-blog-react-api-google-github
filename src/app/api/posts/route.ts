import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { postSchema } from '@/lib/validations/post';
import { slugify } from '@/lib/utils/slugify';

// GET - List all published posts (public) or all posts (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(
        `
        *,
        author:users(id, name, email, image),
        category:categories(id, name, slug),
        tags:post_tags(tag:tags(id, name, slug))
      `,
        { count: 'exact' }
      );

    // Only show published posts to non-admins
    if (session?.user?.role !== 'admin') {
      query = query.eq('status', 'published');
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      posts: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const body = await request.json();

    // Validate with Zod
    const validated = postSchema.parse(body);

    // Generate slug if not provided
    const slug = validated.slug || slugify(validated.title);

    const { tags, ...postData } = validated;

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        ...postData,
        slug,
        author_id: session.user.id,
        published_at:
          validated.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      const postTags = tags.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase
        .from('post_tags')
        .insert(postTags);

      if (tagsError) {
        console.error('Error adding tags:', tagsError);
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
