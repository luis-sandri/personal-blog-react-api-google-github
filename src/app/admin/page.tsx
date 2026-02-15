import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { FileText, FolderOpen, Tags, MessageSquare } from 'lucide-react';

export default function AdminPage() {
  const stats = [
    {
      title: 'Posts',
      value: '-',
      icon: FileText,
      href: '/admin/posts',
      color: 'text-blue-600',
    },
    {
      title: 'Categorias',
      value: '-',
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'text-green-600',
    },
    {
      title: 'Tags',
      value: '-',
      icon: Tags,
      href: '/admin/tags',
      color: 'text-purple-600',
    },
    {
      title: 'Comentários',
      value: '-',
      icon: MessageSquare,
      href: '/admin/comments',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Clique para gerenciar
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nenhum post ainda. Crie seu primeiro post para começar!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comentários Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nenhum comentário pendente de moderação.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold mb-2">Bem-vindo ao seu blog!</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Este é o dashboard administrativo do seu blog. Aqui você pode gerenciar posts,
          categorias, tags e moderar comentários.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Crie e edite posts com um editor rico de texto</li>
          <li>• Organize seu conteúdo com categorias e tags</li>
          <li>• Modere comentários de usuários</li>
          <li>• Visualize estatísticas do seu blog</li>
        </ul>
      </div>
    </div>
  );
}
