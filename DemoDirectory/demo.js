var canvas, ctx;

var dragging = false;

var ball;

var Ball = function() {
  this.pos = new Point(canvas.width / 2, canvas.height / 2);
  this.line = Array;

  this.trail = new TrailRenderer(1, 0.25);

  this.render = function(ctx) {
    this.trail.render(ctx);
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
};

var Point = function(x, y) {
  this.x = x;
  this.y = y;

  this.distance = function(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }
};

var TrailRenderer = function(width, time, minVertexDistance = 0.1) {
  this.width = width;
  this.time = time;
  this.minVertexDistance = minVertexDistance;

  this.vertices = [];
  this.times = [];

  this.update = function(pos, timestamp) {
    var last = this.vertices[0];
    var first = this.vertices[this.vertices.length - 1];

    if(last == null || last == 'undefined' || last.distance(pos) > this.minVertexDistance) {
      this.vertices.push(new Point(pos.x, pos.y));
      this.times.push(timestamp);
    }

    if(this.times.length > 0) {
      while(this.times[0] < timestamp - this.time * 1000) {
        this.vertices.shift();
        this.times.shift();
      }
    }
  }

  this.render = function(ctx) {
    ctx.beginPath();
    if(this.vertices.length > 0) {
      ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
      this.vertices.map(function(vert, index) {
        ctx.lineTo(vert.x, vert.y);
      });
    }
    ctx.stroke();
  }
};

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.render(ctx);
}

function mousemove(e) {
  if(dragging) {
    ball.pos.x = e.offsetX;
    ball.pos.y = e.offsetY;
  }
}

function mousedown(e) {
  dragging = true;
}

function mouseup(e) {
  dragging = false;
}

function update(timestamp) {
  ball.trail.update(ball.pos, timestamp);
  redraw();
  window.requestAnimationFrame(update);
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

window.requestAnimationFrame(update);
