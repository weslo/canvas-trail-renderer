var canvas, ctx;

var dragging = false;
var ball = new Point(0, 0);

var line = Array;

var Point = function(x, y) {
  this.x = x;
  this.y = y;
};

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function mousemove(e) {
  if(dragging) {
    ball.x = e.offsetX;
    ball.y = e.offsetY;
    redraw();
  }
}

function mousedown(e) {
  dragging = true;
}

function mouseup(e) {
  dragging = false;
}

window.onload = function() {
  canvas = document.getElementById('canvas');

  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  posX = canvas.width / 2;
  posY = canvas.height / 2;

  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mousedown", mousedown);
  canvas.addEventListener("mouseup", mouseup);

  redraw();
}
