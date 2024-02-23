import { handleApi, handleError, handleFile } from "./handlers.ts";

const allowedPathList = [
  "/",
  "/script.js",
  "/style.css",
];

async function genResponseArgs(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname === "/api") {
    return await handleApi(searchParams);
  }
  if (allowedPathList.includes(pathname)) {
    const filename = pathname === "/"
      ? "index.html"
      : pathname.replace("/", "");
    return await handleFile(filename);
  }
  return handleError(404, "Not found");
}

Deno.serve(async (request: Request) =>
  new Response(...await genResponseArgs(request))
);
