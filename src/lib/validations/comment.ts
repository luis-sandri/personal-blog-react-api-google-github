import { z } from 'zod';

export const commentSchema = z.object({
  post_id: z.string().uuid('ID de post inválido'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(1000, 'Comentário muito longo'),
  parent_id: z.string().uuid('ID de comentário pai inválido').optional().nullable(),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório').max(1000, 'Comentário muito longo').optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>;
