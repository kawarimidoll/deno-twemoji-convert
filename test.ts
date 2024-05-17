import { assert, assertEquals } from "@std/assert";
import { handleApi, handleError, handleFile } from "./handlers.ts";

// disable log
console.log = (..._args: unknown[]) => {};

Deno.test("[handleError] 404: Not found", () => {
  assertEquals(
    handleError(404, "Not found"),
    ["404: Not found", { status: 404, statusText: "Not found" }],
  );
});

Deno.test("[handleFile] successful html", async () => {
  // no test about contents
  const [html, init] = await handleFile("index.html");
  assert(html);
  assertEquals(
    init,
    { headers: { "content-type": "text/html" } },
  );
});

Deno.test("[handleFile] successful js", async () => {
  // no test about contents
  const [js, init] = await handleFile("script.js");
  assert(js);
  assertEquals(
    init,
    { headers: { "content-type": "text/javascript" } },
  );
});

Deno.test("[handleApi] Invalid emoji parameter", async () => {
  const params = new URLSearchParams();
  params.set("emoji", "");
  assertEquals(
    await handleApi(params),
    [
      "400: Invalid emoji parameter",
      { status: 400, statusText: "Invalid emoji parameter" },
    ],
  );
  params.set("emoji", "0");
  assertEquals(
    await handleApi(params),
    [
      "400: Invalid emoji parameter",
      { status: 400, statusText: "Invalid emoji parameter" },
    ],
  );
});

Deno.test("[handleApi] successful", async () => {
  // no test about contents
  const params = new URLSearchParams();
  params.set("emoji", "🦕");
  assertEquals(
    await handleApi(params),
    [
      "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f995.png",
      {},
    ],
  );
});
