import { Metadata } from 'next';
import { SignInButton } from '@/components/auth/SignInButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Entrar - Blog Pessoal',
  description: 'Faça login no Blog Pessoal',
};

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Bem-vindo de volta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Entre com sua conta para acessar o blog
            </p>
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
