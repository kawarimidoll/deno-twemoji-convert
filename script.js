const img = document.getElementById("img");
const input = document.getElementById("input");
const output = document.getElementById("output");

let lastInput = "";

const callAPI = async () => {
  if (lastInput === input.value) return;
  lastInput = input.value;
  if (!input.value) {
    output.value = "";
    img.src = "";
    return;
  }
  const res = await fetch("./api?emoji=" + encodeURI(input.value));
  if (res.ok) {
    const src = await res.text();
    output.value = src;
    img.src = src;
  } else {
    output.value = "There is no such twemoji...";
    img.src = "";
  }
};

// deno-lint-ignore no-unused-vars
const copyURL = () => {
  output.select();
  document.execCommand("Copy");
};

globalThis.addEventListener("load", (_event) => {
  setInterval(callAPI, 1000);
});
