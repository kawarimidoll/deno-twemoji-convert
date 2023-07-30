const img = document.getElementById("img");
const input = document.getElementById("input");
const output = document.getElementById("output");
const copyFeedback = document.getElementById("copy-feedback");

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

output.addEventListener("click", () => {
  if (!img.src) return;

  output.select();

  const clipboard = navigator.clipboard || window.clipboard;
  clipboard.writeText(output.value)
    .then(() => {
      copyFeedback.classList.add("show");
    })
    .then(() =>
      setTimeout(() => {
        copyFeedback.classList.remove("show");
      }, 1000)
    );
});

globalThis.addEventListener("load", (_event) => {
  setInterval(callAPI, 1000);
});
