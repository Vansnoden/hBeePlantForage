
import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from 'zod';
import { cookies } from 'next/headers';
import { AUTH_URL, USERINFO_URL } from '@/app/lib/constants';
import { NextRequest } from "next/server";


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
                const res_content = response.json();
                if ((await res_content).token_type){
                    // set cookie
                    const cookieStore = await cookies();
                    cookieStore.set("auth-token", (await res_content).token_type + "__" + (await res_content).access_token, {
                        maxAge: 60 * 60 * 24 * 7, // One week
                        secure: false,
                        httpOnly: false,
                        path: "/"
                    })
                    const userData = await getUser((await res_content).token_type + " " + (await res_content).access_token)
                    return userData;
                }else{
                    console.log('Invalid credentials');
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    }
};


const handler = NextAuth(authOptions);


export const GET = handler;
export const POST = handler;

