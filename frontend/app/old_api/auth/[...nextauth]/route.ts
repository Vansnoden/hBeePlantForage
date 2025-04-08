
import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from 'zod';
import { AUTH_URL, USERINFO_URL } from '@/app/lib/constants';


async function getUser(token: string) {
    const userData = await fetch(USERINFO_URL, {
        method: 'GET',
        headers: {
            "Authorization": token
        }
    }).then((res) => res.json())
    return userData;
}


const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                .object({ username: z.string(), password: z.string().min(4) })
                .safeParse(credentials);
                const formData = new FormData();
                formData.append("username", parsedCredentials.data?.username as string);
                formData.append("password", parsedCredentials.data?.password as string);
                const response = await fetch(AUTH_URL, {
                    method: 'POST',
                    body: formData
                })
        
                const data = await response.json();
        
                if (!data?.access_token || !data?.token_type) return null;
        
                const token = `${data.token_type} ${data.access_token}`;
                const user = await getUser(token);
        
                if (!user) return null;
        
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    accessToken: token,
                    tokenType: data.token_type,
                };
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({token, user}){
            if (user) {
                token.accessToken = (user as any).accessToken;// eslint-disable-line
                token.tokenType = (user as any).tokenType;// eslint-disable-line
            }
            return token;
        },
        async session({session, token}){
            (session.user as any).accessToken = token.accessToken;// eslint-disable-line
            (session.user as any).tokenType = token.tokenType;// eslint-disable-line
            return session;
        }
    }
};


const handler = NextAuth(authOptions);


export { handler as GET, handler as POST};