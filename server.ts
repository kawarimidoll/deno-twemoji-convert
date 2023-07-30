import { handle404, handleApi, handleJs, handleRoot } from "./handlers.ts";

async function genResponseArgs(request: Request) {
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

Deno.serve(async (request: Request) => {
  const [bodyInit, responseInit] = await genResponseArgs(request);
  return new Response(bodyInit, responseInit);
});
