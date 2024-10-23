import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";


interface Data {
  isAllowed: boolean;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return ctx.render!({ isAllowed: cookies.auth });
  },
};


function Login() {
  return (
    <form method="post" action="/api/login">
      <input className="form-field" type="text" name="username" />
      <input className="form-field" type="password" name="password" />
      <button className="btn" type="submit">Submit</button>
    </form>
  );
}


export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
      <div>
        You currently {data.isAllowed ? "are" : "are not"} logged in.
      </div>
      {!data.isAllowed ? <Login /> : <a className="btn btn-warning" href="/api/logout">Logout</a>}
    </div>
  );
}
