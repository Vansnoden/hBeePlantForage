import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface Data {
  isAllowed: boolean;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    if (cookies.auth){
      return ctx.render!({ isAllowed: true });
    }else{
      const url = new URL(req.url);
      url.pathname = "/auth/login";
      return Response.redirect(url);
    }
    
  },
};



export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
      {data.isAllowed ? <div>

        <div class="h-screen grid grid-cols-12">
            {/* navigation  */}
            <div className="col-span-2 bg-blue-200 rounded shadow-lg p-2">
              <h1>Menu</h1>
              <span className="divider"></span>
              <ul>
                <li>
                  <a href="#">Filters</a>
                </li>
              </ul>
              <span className="divider"></span>
              <ul>
                <li>
                  <a href="/api/logout">logout</a>
                </li>
              </ul>
            </div>
            {/* content */}
            <div className="col-span-10 p-2">
              my content
            </div>
        </div>

      </div> : <div>you are not looged in ... <a className="btn btn-warning" href="/api/logout">Logout</a></div>}
    </div>
  );
}
