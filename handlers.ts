/// <reference path="./_deploy.d.ts" />

export function errResponse(
  status: number,
  statusText: string,
  init?: ResponseInit,
) {
  init = { status, statusText, ...(init || {}) };
  return new Response(`${status}: ${statusText}`, init);
}

export async function handleRoot() {
  const html = await Deno.readTextFile("./index.html");
  return new Response(html, { headers: { "content-type": "text/html" } });
}

export function handle404() {
  return errResponse(404, "Not found.");
}

export async function handleJs() {
  const src = await Deno.readTextFile("./script.js");
  return new Response(src, { headers: { "content-type": "text/javascript" } });
}

export async function handleApi(searchParams: URLSearchParams) {
  const emoji = searchParams.get("emoji");
  if (!emoji) {
    return errResponse(400, "Invalid emoji parameter.");
  }
  let version = searchParams.get("version") || "";
  if (!/^\d+\.\d+\.\d$/.test(version)) {
    // use latest version
    version = "13.1.0";
  }
  const p = [...emoji].map((x) => x.codePointAt(0)?.toString(16))[0];
  console.log({ emoji, version, p });

  const twemojiURL = `https://twemoji.maxcdn.com/v/${version}/72x72/${p}.png`;

  const res = await fetch(twemojiURL);
  // confirm to close resource
  await res.text();
  if (res.ok) {
    return new Response(twemojiURL);
  }
  return errResponse(400, "Invalid emoji parameter.");
}
