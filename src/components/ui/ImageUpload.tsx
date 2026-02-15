'use client';

import { useState } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploading ? 'Enviando...' : 'Escolher Imagem'}
          </Button>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <span className="text-sm text-gray-500">
          JPG, PNG, WebP ou GIF (máx. 5MB)
        </span>
      </div>

      {preview && (
        <div className="relative w-full max-w-md">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreview('');
              onUpload('');
            }}
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
}
