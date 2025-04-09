import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { AUTH_URL, USERINFO_URL } from "@/app/lib/constants";


interface User{
    id: Number,
    fullname: String,
    is_active: Boolean,
    username: String,
    email: String,
    accessToken: String
}


async function getUser(token: string) {
  const res = await fetch(USERINFO_URL, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) return null;

  return res.json();
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = z.object({
                    username: z.string(),
                    password: z.string().min(4),
                })
                .safeParse(credentials);

                if (!parsed.success) return null;

                const formData = new FormData();
                formData.append("username", parsed.data.username);
                formData.append("password", parsed.data.password);

                const res = await fetch(AUTH_URL, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!data?.access_token || !data?.token_type) return null;

                const token = `${data.token_type} ${data.access_token}`;
                const user = await getUser(token);

                if (!user) return null;
                else user.accessToken = token;

                return {
                    name: user.username,
                    email: user.email,
                    id: token,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.jti = user.id
            }
            return token;
        },
        async session({ session, token }) {
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});

export const GET = handler;
export const POST = handler;
