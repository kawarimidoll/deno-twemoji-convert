export function handleError(
  status: number,
  statusText: string,
  init: ResponseInit = {},
): [BodyInit, ResponseInit] {
  return [`${status}: ${statusText}`, { status, statusText, ...init }];
}

const contentTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
};

export async function handleFile(filename): Promise<[BodyInit, ResponseInit]> {
  const ext = filename.match(/\.(\w+)$/)?.[1] || "";
  const src = await Deno.readTextFile(filename);
  return [src, { headers: { "content-type": contentTypes[ext] } }];
}

export async function handleApi(
  searchParams: URLSearchParams,
): Promise<[BodyInit, ResponseInit]> {
  const emoji = searchParams.get("emoji");
  if (!emoji) {
    return handleError(400, "Invalid emoji parameter");
  }

  const codePoint = [...emoji].map((x) => x.codePointAt(0)?.toString(16))[0];
  console.log({ emoji, codePoint });

  const twemojiURL =
    `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codePoint}.png`;

  const res = await fetch(twemojiURL);
  // confirm to close resource
  await res.text();
  if (res.ok) {
    return [twemojiURL, {}];
  }
  return handleError(400, "Invalid emoji parameter");
}
