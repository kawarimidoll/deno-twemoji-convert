/// <reference path="./_deploy.d.ts" />

import { handle404, handleApi, handleJs, handleRoot } from "./handlers.ts";

const listener = Deno.listen({ port: 8080 });
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  const { hostname, port } = listener.addr;
  console.log(`HTTP server listening on http://${hostname}:${port}`);
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handler(e.request));
  }
}

async function handler(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  switch (pathname) {
    case "/":
      return await handleRoot();
    case "/api":
      return await handleApi(searchParams);
    case "/script.js":
      return await handleJs();
  }
  return handle404();
}

for await (const conn of listener) {
  handleConn(conn);
}
