import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { postUpdateSchema } from '@/lib/validations/post';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const session = await getServerSession(authOptions);

    let query = supabase
      .from('posts')
      .select(
        `
        *,
        author:users(id, name, email, image),
        category:categories(id, name, slug),
        tags:post_tags(tag:tags(id, name, slug))
      `
      )
      .eq('id', id);

    // Only show published posts to non-admins
    if (session?.user?.role !== 'admin') {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment view count
    supabase
      .from('posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)
      .then();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update post (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const body = await request.json();

    // Validate with Zod
    const validated = postUpdateSchema.parse(body);
    const { tags, ...postData } = validated;

    // Get current post to check published_at
    const { data: currentPost } = await supabase
      .from('posts')
      .select('published_at')
      .eq('id', id)
      .single();

    // Update published_at if status changed to published and not set yet
    if (validated.status === 'published' && !currentPost?.published_at) {
      (postData as any).published_at = new Date().toISOString();
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await supabase.from('post_tags').delete().eq('post_id', id);

      // Add new tags
      if (tags.length > 0) {
        const postTags = tags.map((tagId) => ({
          post_id: id,
          tag_id: tagId,
        }));

        await supabase.from('post_tags').insert(postTags);
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
