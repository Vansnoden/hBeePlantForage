import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { AUTH_URL } from "./constants.ts";


interface AuthData{
    ok: boolean,
    data: object,
}

interface TokenData{
    access_token: string,
    token_type: string,
}


async function authenticate(formData:FormData){
    const authData: AuthData = {
        ok: false,
        data: {}
    }
    const response = await fetch(AUTH_URL, {
        method: 'POST',
        body: formData
    }).then((res) => res.json());
    if(response){
        authData.ok = true;
        authData.data = response;
    }
    return authData;
}


export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const formData = await req.formData();
    const response = authenticate(formData);
    if ((await response).ok) {
      const headers = new Headers();
      const tokenData: TokenData = (await response).data as TokenData
      setCookie(headers, {
        name: "auth",
        value: tokenData.token_type + "__" + tokenData.access_token, // this should be a unique value for each session
        maxAge: 120,
        sameSite: "Lax", // this is important to prevent CSRF attacks
        path: "/",
        domain: url.hostname,
        secure: true,
      });

      headers.set("location", "/");
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    } else {
      return new Response(null, {
        status: 403,
      });
    }
  },
};