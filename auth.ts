import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// создаем функцию которая запрашивает пользователя из базы данных
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`; // отправляем запрос к базе данных, используя шаблонный литерал SQL, чтобы вставить значение email в запрос. Запрос выбирает пользователя из таблицы users по адресу электронной почты.
    return user.rows[0]; // Возвращает первого пользователя из результата запроса. Если пользователь не найден, это будет undefined
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // Добавляем провайдера аутентификации в список провайдеров. В этом случае используется провайдер Credentials, который позволяет пользователям аутентифицироваться с использованием учетных данных (например, электронной почты и пароля).
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password); // проверяем совпадают ли пароли
          if (passwordMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
