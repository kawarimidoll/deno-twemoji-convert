const img = document.getElementById("img");
const input = document.getElementById("input");
const output = document.getElementById("output");

const callAPI = async () => {
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

document
  .getElementById("input")
  .addEventListener("input", window.throttle(callAPI, 2000));

callApi();
