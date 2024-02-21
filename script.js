const img = document.getElementById("img");
const input = document.getElementById("input");
const output = document.getElementById("output");
const radioPng = document.getElementById("radio-png");
const radioSvg = document.getElementById("radio-svg");
const copyFeedback = document.getElementById("copy-feedback");

let lastInput = "";
let lastPng = true;

const callAPI = async () => {
  if (lastInput === input.value && lastPng === radioPng.checked) return;
  lastInput = input.value;
  lastPng = radioPng.checked;
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
    if (radioSvg.checked) {
      output.value = src.replace(/72x72|png/g, "svg");
    }
  } else {
    output.value = "There is no such twemoji...";
    img.src = "";
  }
};

output.addEventListener("click", () => {
  if (!output.value.startsWith("https")) return;

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
