var canvas, ctx;

var dragging = false;

var ball;

var Ball = function() {
  this.pos = new Point(canvas.width / 2, canvas.height / 2);
  this.line = Array;
};

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

  ball = new Ball();

  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mousedown", mousedown);
  canvas.addEventListener("mouseup", mouseup);

  redraw();
}
