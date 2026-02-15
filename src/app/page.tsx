import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, Code, Coffee } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Olá, Bem-vindo!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Compartilhando conhecimento, experiências e aprendizados sobre desenvolvimento de software.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Explorar Artigos
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Sobre este Blog</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Este é um espaço onde compartilho meus aprendizados, experiências e insights sobre desenvolvimento web,
            tecnologias modernas e boas práticas de programação.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Aqui você encontrará artigos sobre React, Next.js, TypeScript, Node.js e muito mais.
          </p>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Temas Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <Code className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Desenvolvimento Web</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tutoriais e dicas sobre frameworks modernos como React, Next.js e tecnologias web.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <Coffee className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Boas Práticas</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aprenda sobre clean code, arquitetura de software e padrões de projeto.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Experiências</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Compartilhando experiências reais de projetos e desafios do dia a dia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore o Blog</h2>
          <p className="text-xl mb-6 opacity-90">
            Confira os últimos artigos e aprenda algo novo hoje!
          </p>
          <Link href="/blog">
            <Button size="lg" variant="secondary">
              Ver Todos os Posts
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
