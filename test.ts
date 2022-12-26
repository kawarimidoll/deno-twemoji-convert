import { assert, assertEquals } from "./deps.ts";
import {
  errResponse,
  handle404,
  handleApi,
  handleJs,
  handleRoot,
} from "./handlers.ts";

// disable log
console.log = (..._args: unknown[]) => {};

Deno.test("[errResponse] 404: Not found", () => {
  assertEquals(
    errResponse(404, "Not found"),
    ["404: Not found", { status: 404, statusText: "Not found" }],
  );
});

Deno.test("[handle404] 404: Not found", () => {
  assertEquals(
    handle404(),
    ["404: Not found", { status: 404, statusText: "Not found" }],
  );
});

Deno.test("[handleRoot] successful", async () => {
  // no test about contents
  const [html, init] = await handleRoot();
  assert(html);
  assertEquals(
    init,
    { headers: { "content-type": "text/html" } },
  );
});

Deno.test("[handleJs] successful", async () => {
  // no test about contents
  const [js, init] = await handleJs();
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
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@13.1.0/assets/72x72/1f995.png",
      {},
    ],
  );
});
