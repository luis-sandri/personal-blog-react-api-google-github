import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { tagSchema } from '@/lib/validations/tag';

// GET /api/tags - List all tags
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar tags' },
        { status: 500 }
      );
    }

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create new tag (admin only)
export async function POST(request: NextRequest) {
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
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      return NextResponse.json(
        { error: 'Erro ao criar tag' },
        { status: 500 }
      );
    }

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
