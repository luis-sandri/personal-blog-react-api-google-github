import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Use admin client to bypass RLS for user creation
        const supabase = createAdminClient();

        // Check if user exists - use maybeSingle() to avoid error when not found
        const { data: existingUser, error: selectError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (selectError) {
          console.error('Error checking user:', selectError);
          return false;
        }

        if (!existingUser) {
          // Create new user
          const { error: insertError } = await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'user', // Default role
          });

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }

          console.log('✅ User created successfully:', user.email);
        } else {
          console.log('✅ User already exists:', user.email);
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        // Add token data to session
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // On sign in, fetch user data from Supabase
      if (user && user.email) {
        const supabase = createAdminClient();
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email)
          .maybeSingle();

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      // On token update, refresh role from database
      if (trigger === 'update' && token.email) {
        const supabase = createAdminClient();
        const { data: dbUser } = await supabase
          .from('users')
          .select('role')
          .eq('email', token.email as string)
          .maybeSingle();

        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
