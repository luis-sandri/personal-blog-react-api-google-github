import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { tagSchema } from '@/lib/validations/tag';

// GET /api/tags/[id] - Get single tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    const { data: tag, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in GET /api/tags/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id] - Update tag (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = tagSchema.parse(body);

    const supabase = createAdminClient();

    const { data: tag, error } = await supabase
      .from('tags')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in PUT /api/tags/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete tag (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('tags').delete().eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao deletar tag' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Tag deletada com sucesso' });
  } catch (error) {
    console.error('Error in DELETE /api/tags/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
