'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { slugify } from '@/lib/utils/slugify';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    tag_ids: [] as string[],
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags'),
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setTags(tagsData);
      }
    } catch (error) {
      console.error('Error fetching categories/tags:', error);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    });
  };

  const handleTagToggle = (tagId: string) => {
    setFormData({
      ...formData,
      tag_ids: formData.tag_ids.includes(tagId)
        ? formData.tag_ids.filter((id) => id !== tagId)
        : [...formData.tag_ids, tagId],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar post');
      }

      router.push('/admin/posts');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar post');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/posts">
          <Button variant="outline" size="sm">
            ← Voltar
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Criar Novo Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do post"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="url-do-post"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL amigável. Gerado automaticamente a partir do título.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Conteúdo *
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
                placeholder="Escreva o conteúdo do seu post aqui..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Resumo</label>
              <Input
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Breve resumo do post (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Imagem de Capa
              </label>
              <ImageUpload
                currentImage={formData.featured_image}
                onUpload={(url) =>
                  setFormData({ ...formData, featured_image: url })
                }
              />
              <p className="text-xs text-gray-500 mt-2">Ou cole a URL:</p>
              <Input
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="https://exemplo.com/imagem.jpg"
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Categoria *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  <Link
                    href="/admin/categories"
                    className="text-blue-600 hover:underline"
                  >
                    Criar primeira categoria
                  </Link>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tag_ids.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  <Link
                    href="/admin/tags"
                    className="text-blue-600 hover:underline"
                  >
                    Criar primeira tag
                  </Link>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'published',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/posts">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
