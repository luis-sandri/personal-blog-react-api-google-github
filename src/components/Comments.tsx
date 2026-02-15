'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/formatDate';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?post_id=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar comentário');
      }

      setMessage(data.message || 'Comentário enviado com sucesso!');
      setContent('');
      // Don't fetch comments immediately as it needs moderation
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Erro ao enviar comentário'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Comentários ({comments.length})
      </h2>

      {/* Comment form */}
      {session ? (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva seu comentário..."
              rows={4}
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Seu comentário será moderado antes de aparecer.
              </p>
              <Button type="submit" disabled={submitting || !content.trim()}>
                {submitting ? 'Enviando...' : 'Enviar Comentário'}
              </Button>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.includes('sucesso') || message.includes('moderação')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </Card>
      ) : (
        <Card className="p-6 mb-8 text-center">
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para comentar.
          </p>
          <Link href="/signin">
            <Button>Entrar</Button>
          </Link>
        </Card>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-500">Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
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
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
