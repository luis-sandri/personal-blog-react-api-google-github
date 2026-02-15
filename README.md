# Blog Pessoal

Um blog pessoal moderno e completo construído com Next.js 15, React 19, TypeScript e Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Sobre o Projeto

Este é um blog pessoal full-stack onde compartilho conhecimentos, experiências e aprendizados sobre desenvolvimento de software. O projeto possui um sistema completo de gerenciamento de conteúdo (CMS) integrado, permitindo criar, editar e publicar posts de forma fácil e intuitiva.

**Link do site:** [https://personal-blog-react-api-google-gith-six.vercel.app](https://personal-blog-react-api-google-gith-six.vercel.app)

<img width="1909" height="873" alt="image" src="https://github.com/user-attachments/assets/68b69ea6-9df0-4b0f-99fb-c1301a27a6cd" />
<img width="1909" height="867" alt="image" src="https://github.com/user-attachments/assets/105824d2-6d1f-40f9-9693-44140a294774" />
<img width="1918" height="878" alt="image" src="https://github.com/user-attachments/assets/54b8ecbb-92f5-408b-b59b-7e3aba0bff18" />


## ✨ Funcionalidades

### Área Pública
- 📖 Listagem de posts com paginação
- 🔍 Filtro por categorias e tags
- 💬 Sistema de comentários
- 📱 Design responsivo e moderno
- 🌓 Suporte a tema claro/escuro
- 🖼️ Suporte a imagens destacadas nos posts

### Área Administrativa
- 🔐 Autenticação com Google e GitHub (NextAuth)
- ✍️ Editor de texto rico (TiptapEditor) com suporte a:
  - Formatação de texto
  - Inserção de imagens
  - Links
  - Listas e citações
- 📝 CRUD completo de posts
- 🏷️ Gerenciamento de categorias e tags
- 💬 Moderação de comentários
- 📊 Status de publicação (rascunho/publicado)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **TipTap** - Editor de texto rico
- **Lucide React** - Ícones modernos
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend & Infraestrutura
- **Supabase** - Backend como serviço (BaaS)
  - PostgreSQL (Banco de dados)
  - Autenticação
  - Storage para imagens
- **NextAuth** - Autenticação OAuth (Google & GitHub)

## 📋 Pré-requisitos

- Node.js 20+ instalado
- npm ou yarn
- Conta no [Supabase](https://supabase.com/)
- Credenciais OAuth do [Google](https://console.cloud.google.com/) e/ou [GitHub](https://github.com/settings/developers)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/luis-sandri/personal-blog-react-api-google-github.git
cd personal-blog-react-api-google-github
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e preencha as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_supabase

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_gerado

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# GitHub OAuth
GITHUB_ID=seu_github_oauth_id
GITHUB_SECRET=seu_github_oauth_secret
```

### Como obter as credenciais:

**Supabase:**
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto
3. Vá em Settings → API
4. Copie a URL e as chaves

**NextAuth Secret:**
```bash
openssl rand -base64 32
```

**Google OAuth:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Ative a API do Google+
4. Crie credenciais OAuth 2.0
5. Adicione `http://localhost:3000/api/auth/callback/google` às URIs autorizadas

**GitHub OAuth:**
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie uma nova OAuth App
3. Use `http://localhost:3000/api/auth/callback/github` como callback URL

## 🗄️ Configuração do Banco de Dados

Execute os seguintes comandos SQL no seu projeto Supabase:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tags
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES categories(id),
  author_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento posts-tags
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Tabela de comentários
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura
CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON comments FOR SELECT USING (approved = true);
```

Também configure o Storage no Supabase:
1. Crie um bucket chamado `uploads`
2. Configure as políticas de acesso público para leitura

## 🚀 Como Executar

### Modo Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
projeto-7/
├── src/
│   ├── app/                      # App Router do Next.js
│   │   ├── admin/                # Área administrativa
│   │   │   ├── posts/            # Gerenciamento de posts
│   │   │   ├── categories/       # Gerenciamento de categorias
│   │   │   ├── tags/             # Gerenciamento de tags
│   │   │   └── comments/         # Moderação de comentários
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/             # Autenticação NextAuth
│   │   │   ├── posts/            # CRUD de posts
│   │   │   ├── categories/       # CRUD de categorias
│   │   │   ├── tags/             # CRUD de tags
│   │   │   ├── comments/         # CRUD de comentários
│   │   │   └── upload/           # Upload de imagens
│   │   ├── blog/                 # Páginas públicas do blog
│   │   │   ├── [slug]/           # Post individual
│   │   │   ├── categoria/[slug]/ # Posts por categoria
│   │   │   └── tag/[slug]/       # Posts por tag
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── page.tsx              # Página inicial
│   │   └── globals.css           # Estilos globais
│   ├── components/               # Componentes React
│   │   ├── auth/                 # Componentes de autenticação
│   │   ├── layout/               # Header, Footer
│   │   ├── ui/                   # Componentes de UI
│   │   ├── Comments.tsx          # Sistema de comentários
│   │   ├── Providers.tsx         # Providers globais
│   │   └── TiptapEditor.tsx      # Editor de texto
│   ├── lib/                      # Bibliotecas e utilitários
│   │   ├── auth/                 # Configuração NextAuth
│   │   └── supabase/             # Clientes Supabase
│   └── middleware.ts             # Middleware de autenticação
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
├── next.config.js                # Configuração do Next.js
├── tailwind.config.ts            # Configuração do Tailwind
├── tsconfig.json                 # Configuração do TypeScript
└── package.json                  # Dependências do projeto
```

## 🔐 Autenticação e Autorização

O sistema implementa autenticação OAuth utilizando NextAuth com os providers:
- Google
- GitHub

Apenas usuários autenticados têm acesso à área administrativa (`/admin`).

## 📝 Licença

Este projeto é de uso pessoal e educacional.

## 👤 Autor

**Luis Sandri**

- GitHub: [@luis-sandri](https://github.com/luis-sandri)
- LinkedIn: [luis-sandri](https://www.linkedin.com/in/luis-sandri/)

## 🤝 Contribuições

Contribuições, issues e feature requests são bem-vindos!

---

⭐ Desenvolvido com Next.js, React e Supabase
