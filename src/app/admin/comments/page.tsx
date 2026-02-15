'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';

interface Comment {
  id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();

      const { data } = await supabase
        .from('comments')
        .select(
          `
          id,
          content,
          status,
          created_at,
          user:users(id, name, image),
          post:posts(id, title, slug)
        `
        )
        .order('created_at', { ascending: false });

      setComments(data as any || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar comentário');

      await fetchComments();
    } catch (error) {
      alert('Erro ao atualizar comentário');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) return;

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar comentário');

      await fetchComments();
    } catch (error) {
      alert('Erro ao deletar comentário');
    }
  };

  const filteredComments = comments.filter((comment) =>
    filter === 'all' ? true : comment.status === filter
  );

  const statusCounts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Comentários</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todos ({statusCounts.all})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pendentes ({statusCounts.pending})
        </Button>
        <Button
          variant={filter === 'approved' ? 'primary' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Aprovados ({statusCounts.approved})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'primary' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejeitados ({statusCounts.rejected})
        </Button>
      </div>

      {filteredComments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Nenhum comentário{' '}
            {filter !== 'all' ? `com status "${filter}"` : ''}.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment: any) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start gap-4">
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{comment.user.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                    <Badge
                      variant={
                        comment.status === 'approved'
                          ? 'success'
                          : comment.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {comment.status === 'approved'
                        ? 'Aprovado'
                        : comment.status === 'rejected'
                        ? 'Rejeitado'
                        : 'Pendente'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Post:{' '}
                    <a
                      href={`/blog/${comment.post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {comment.post.title}
                    </a>
                  </p>

                  <p className="text-gray-700 whitespace-pre-wrap mb-4">
                    {comment.content}
                  </p>

                  <div className="flex gap-2">
                    {comment.status !== 'approved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(comment.id, 'approved')}
                      >
                        Aprovar
                      </Button>
                    )}
                    {comment.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                      >
                        Rejeitar
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
