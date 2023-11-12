const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImgBtn = document.querySelector(".save-img");

let ctx = canvas.getContext("2d"),
  isDrowing = false,
  brushWidth = 5,
  selectedTool = "brush",
  prevMouseX,
  prevMouseY,
  snapshot,
  selectedColor = "#000";

const setCannvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCannvasBackground();
});

const startDraw = (e) => {
  isDrowing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const drowRectangle = (e) => {
  if (!fillColor.checked) {
    ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  } else {
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
};

const drowCircle = (e) => {
  ctx.beginPath();
  const radius =
    Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) +
    Math.pow(prevMouseY - e.offsetY, 2);
  ctx.arc(prevMouseX, prevMouseY, radius / 200, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drowTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawing = (e) => {
  if (!isDrowing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drowRectangle(e);
      break;
    case "circle":
      drowCircle(e);
      break;
    case "triangle":
      drowTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    default:
      break;
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCannvasBackground();
});

saveImgBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Muhammad-point${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

const stopDraw = () => {
  isDrowing = false;
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
