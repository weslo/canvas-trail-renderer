var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var dragging = false;

var posX = canvas.width / 2;
var posY = canvas.height / 2;

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(posX, posY, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function mousemove(e) {
  if(dragging) {
    posX = e.offsetX;
    posY = e.offsetY;
    redraw();
  }
}

function mousedown(e) {
  dragging = true;
}

function mouseup(e) {
  dragging = false;
}

canvas.addEventListener("mousemove", movemove);
canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
