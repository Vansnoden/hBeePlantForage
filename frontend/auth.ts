import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { AUTH_URL, USERINFO_URL } from './app/lib/constants';
import { cookies } from 'next/headers'

async function getUser(token: string) {
    const userData = await fetch(USERINFO_URL, {
        method: 'GET',
        headers: {
            "Authorization": token
        }
    }).then((res) => res.json())
    return userData;
}



export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
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
        // console.log("-----------");
        // console.log(await res_content);
        if ((await res_content).token_type){
            // set cookie
            const cookieStore = await cookies();
            cookieStore.set("auth-token", (await res_content).token_type + "__" + (await res_content).access_token, {
                maxAge: 86400,
                domain: "212.56.40.148",
                secure: true,
                sameSite: 'none',
                path: "/"
            })
            const userData = await getUser((await res_content).token_type + " " + (await res_content).access_token)
            return userData;
        }else{
            console.log('Invalid credentials');
            return null;
        }
    },
  })],
});


