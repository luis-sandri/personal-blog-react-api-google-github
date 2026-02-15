import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';

// DELETE /api/comments/[id] - Delete comment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from('comments').delete().eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao deletar comentário' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error('Error in DELETE /api/comments/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/comments/[id] - Update comment status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: comment, error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single();

    if (error || !comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in PATCH /api/comments/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
