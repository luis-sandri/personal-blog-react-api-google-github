import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';

// GET /api/comments?post_id=xxx - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');

    if (!postId) {
      return NextResponse.json(
        { error: 'post_id é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: comments, error } = await supabase
      .from('comments')
      .select(
        `
        id,
        content,
        created_at,
        user:users(id, name, image)
      `
      )
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', {  ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar comentários' },
        { status: 500 }
      );
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create new comment (logged in users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { post_id, content } = body;

    if (!post_id || !content) {
      return NextResponse.json(
        { error: 'post_id e content são obrigatórios' },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comentário muito curto' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id,
        user_id: session.user.id,
        content: content.trim(),
        status: 'pending', // Pending moderation by default
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: 'Erro ao criar comentário' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...comment,
        message: 'Comentário enviado para moderação',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
