var canvas, ctx;

var dragging = false;

var ball;

var visualize = true;

var Ball = function() {
  this.pos = new Point(canvas.width / 2, canvas.height / 2);
  this.line = Array;

  this.trail = new TrailRenderer(10, 5);

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

  this.magnitude = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  this.normalize = function() {
    var mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    return this;
  }

  this.against = function(a, b) {
    return ((b.x - a.x) * (this.y - a.y) - (b.y - a.y) * (this.y - a.x));
  }
};

var TrailRenderer = function(width, time, minVertexDistance = 10) {
  this.width = width;
  this.time = time;
  this.minVertexDistance = minVertexDistance;

  this.points = [];
  this.times = [];

  this.update = function(pos, timestamp) {
    var last = this.points[0];
    var first = this.points[this.points.length - 1];

    if(!last || first.distance(pos) > this.minVertexDistance) {
      this.points.push(new Point(pos.x, pos.y));
      this.times.push(timestamp);
    }

    if(this.times.length > 0) {
      while(this.times[0] < timestamp - this.time * 1000) {
        this.points.shift();
        this.times.shift();
      }
    }
  }

  this.render = function(ctx) {
    ctx.beginPath();

    if(this.points.length > 0) {
      ctx.moveTo(this.points[0].x, this.points[0].y);

      var vertices = [];
      this.points.map(function(p, i, points) {
        var prev = i > 0 ? points[i - 1] : null;
        var next = i < points.length - 1 ? points[i + 1] : null;
        var w = this.evalWidth(i);

        if(!prev) {
          vertices.push(p);
        }
        else {

          if(next == null) {
            next = p;
          }

          var v = new Point(next.y - prev.y, next.x - prev.x).normalize();

          var a = new Point(p.x + v.x * w, p.y + v.y * w);
          var b = new Point(p.x - v.x * w, p.y - v.y * w);

          vertices.splice(i, 0, a, b);
        }
      }, this);

      vertices.push(vertices[0]);

      vertices.map(function(v) {
        ctx.lineTo(v.x, v.y);
      });
    }

    ctx.stroke();

    if(visualize) {
      this.points.map(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }

  this.evalWidth = function(index) {
    return this.width * index / this.points.length;
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
  ball.pos.x = e.offsetX;
  ball.pos.y = e.offsetY;
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
