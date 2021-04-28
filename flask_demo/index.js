const POINT_SIZE = 3;
const RED = "#ff0000";
const BLUE = "#0000ff";

const canvas = document.getElementById("canvas");
const run = document.getElementById("run");
const animationContainer = document.getElementById("animation-container");

let points = [];

canvas.onclick = function (event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  points.push([x, y]);

  drawPoint(x, y, RED);
};

run.onclick = function (_event) {
  let r = new XMLHttpRequest();
  r.open("POST", "/api/animate", true);
  r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  r.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) {
      return;
    }
    animationContainer.innerHTML = this.response;
    setTimeout(function () {
      for (child of animationContainer.children) {
        console.log(child);
        if (child.tagName === "SCRIPT") {
          console.log("evaling");
          // TODO: THIS IS VERY VERY VERY EVIL. Instead, I should figure out how
          // to return just the frames I want
          eval(child.innerHTML);
        }
      }
    }, 0);
  };

  r.send(
    JSON.stringify({
      points: points,
      // TODO: Have input
      frames: 15,
    })
  );
};

function drawPoint(x, y, color) {
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, POINT_SIZE, 0, Math.PI * 2, true);
  ctx.fill();
}
