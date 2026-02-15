import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  excerpt: z.string().max(500, 'Resumo muito longo').optional().nullable(),
  featured_image: z.string().url('URL de imagem inválida').optional().nullable(),
  category_id: z.string().uuid('ID de categoria inválido').optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  tags: z.array(z.string().uuid()).optional(),
});

export const postUpdateSchema = postSchema.partial();

export type PostInput = z.infer<typeof postSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
