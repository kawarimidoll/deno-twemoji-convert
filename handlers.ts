const VERSION = "13.1.0";

export function errResponse(
  status: number,
  statusText: string,
  init?: ResponseInit,
): [BodyInit, ResponseInit] {
  init = { status, statusText, ...(init || {}) };
  return [`${status}: ${statusText}`, init];
}

export async function handleRoot(): Promise<[BodyInit, ResponseInit]> {
  const html = await Deno.readTextFile("./index.html");
  return [html, { headers: { "content-type": "text/html" } }];
}

export function handle404(): [BodyInit, ResponseInit] {
  return errResponse(404, "Not found");
}

export async function handleJs(): Promise<[BodyInit, ResponseInit]> {
  const src = await Deno.readTextFile("./script.js");
  return [src, { headers: { "content-type": "text/javascript" } }];
}

export async function handleApi(
  searchParams: URLSearchParams,
): Promise<[BodyInit, ResponseInit]> {
  const emoji = searchParams.get("emoji");
  if (!emoji) {
    return errResponse(400, "Invalid emoji parameter");
  }

  const codePoint = [...emoji].map((x) => x.codePointAt(0)?.toString(16))[0];
  console.log({ emoji, codePoint });

  const twemojiURL =
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@${VERSION}/assets/72x72/${codePoint}.png`;

  const res = await fetch(twemojiURL);
  // confirm to close resource
  await res.text();
  if (res.ok) {
    return [twemojiURL, {}];
  }
  return errResponse(400, "Invalid emoji parameter");
}
