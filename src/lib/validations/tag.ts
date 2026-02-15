import { z } from 'zod';

export const tagSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
});

export const tagUpdateSchema = tagSchema.partial();

export type TagInput = z.infer<typeof tagSchema>;
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
