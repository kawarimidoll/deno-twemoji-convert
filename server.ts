import { handleApi, handleFile } from "./handlers.ts";

async function genResponseArgs(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname === "/api") {
    return await handleApi(searchParams);
  }
  return await handleFile(pathname);
}

Deno.serve(async (request: Request) => {
  const [bodyInit, responseInit] = await genResponseArgs(request);
  return new Response(bodyInit, responseInit);
});
