const img = document.getElementById("img");
const input = document.getElementById("input");
const output = document.getElementById("output");
const radioPng = document.getElementById("radio-png");
const radioSvg = document.getElementById("radio-svg");
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
    img.src = src;
    output.value = radioPng.checked ? src : src.replace(/72x72|png/g, "svg");
  } else {
    output.value = "There is no such twemoji...";
    img.src = "";
  }
};

const selectPng = () => {
  if (img.src) {
    output.value = output.value.replace(/svg/, "72x72").replace(/svg/, "png");
  }
};
const selectSvg = () => {
  if (img.src) {
    output.value = output.value.replace(/72x72|png/g, "svg");
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
radioPng.addEventListener("change", selectPng);
radioSvg.addEventListener("change", selectSvg);
