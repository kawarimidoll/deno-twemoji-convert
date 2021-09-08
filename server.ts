/// <reference path="./_deploy.d.ts" />

const listener = Deno.listen({ port: 8080 });
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  const { hostname, port } = listener.addr;
  console.log(`HTTP server listening on http://${hostname}:${port}`);
}

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handler(e.request, conn));
  }
}

function errResponse(status: number, statusText: string, init?: ResponseInit) {
  init = { status, statusText, ...(init || {}) };
  return new Response(`${status}: ${statusText}`, init);
}

async function handler(request: Request, _conn: Deno.Conn) {
  const { pathname, searchParams } = new URL(request.url);
  // console.log({ href, origin, host, pathname, hash, search });

  if (pathname === "/") {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, { headers: { "content-type": "text/html" } });
  }
  if (pathname === "/api") {
    const emoji = searchParams.get("emoji") || "";
    let version = searchParams.get("version") || "";
    if (!/^\d+\.\d+\.\d$/.test(version)) {
      // use latest version
      version = "13.1.0";
    }
    const p = [...emoji].map((x) => x.codePointAt(0)?.toString(16))[0];
    console.log({ emoji, version, p });

    const twemojiURL = `https://twemoji.maxcdn.com/v/${version}/72x72/${p}.png`;

    const res = await fetch(twemojiURL);
    if (res.ok) {
      return new Response(twemojiURL);
    }
    return errResponse(400, "Invalid emoji parameter.");
  }

  if (pathname === "/index.js") {
    const src = await Deno.readTextFile("./index.js");
    return new Response(src, {
      headers: { "content-type": "text/javascript" },
    });
  }
  return errResponse(404, "Not found.");
}

for await (const conn of listener) {
  handleConn(conn);
}
