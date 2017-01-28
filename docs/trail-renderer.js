/*
*   Experiment simulating the Unity3D TrailRenderer in canvas.
*   By Wes Rockholz
*   @wrockholz
*   http://weslo.github.io
*/

// If set to true, renders the line so points and verts are more visible.
var visualize = false;

// Lazy global vars.
var canvas, ctx;
var ball;
var dragging = false;

// A 2D point or vector.
var Point = function(x, y) {
  this.x = x;
  this.y = y;

  // Distance to another Point.
  this.distance = function(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }

  // Magnitude of this vector.
  this.magnitude = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  // Normalizes this vector and returns itself.
  this.normalize = function() {
    var mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    return this;
  }
};

// The ball with a trail, used as a barebones game object.
var Ball = function() {

  this.pos = new Point(canvas.width / 2, canvas.height / 2);
  this.trail = new TrailRenderer(20, 1);

  // Render the ball to the canvas context.
  this.render = function(ctx) {
    ctx.fillStyle = "#4CAF50";
    ctx.strokeStyle = "#4CAF50";
    this.trail.render(ctx);
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// A TrailRenderer component that would be attached to a game object.
var TrailRenderer = function(width, time, minVertexDistance = 10) {

  this.width = width; // Width of the trail at the head.
  this.time = time; // The time in seconds each point on the trail lasts.
  this.minVertexDistance = minVertexDistance; // The minimum distance between vertices.

  this.points = []; // The points on the trail.
  this.times = []; // The time each point was dropped.

  // Update the trail renderer between frames.
  this.update = function(pos, timestamp) {

    var last = this.points[0]; // The point at the end of the trail.
    var first = this.points[this.points.length - 1]; // The point at the front of the trail.

    // Drop a new point if there isn't one yet or if we've travelled far enough to create a new one.
    if(!last || first.distance(pos) > this.minVertexDistance) {
      this.points.push(new Point(pos.x, pos.y));
      this.times.push(timestamp);
    }

    // Check if the points at the end of the list need to decay.
    if(this.times.length > 0) {
      while(this.times[0] < timestamp - this.time * 1000) {
        this.points.shift();
        this.times.shift();
      }
    }
  }

  // Render the trail.
  this.render = function(ctx) {

    if(this.points.length > 0) {

      // Each point is made up of two verts that form the width of the trail.
      // We need to turn it into one single shape to fill.
      var vertices = [];
      this.points.forEach(function(p, i, points) {

        var prev = i > 0 ? points[i - 1] : null; // The previous point.
        var next = i < points.length - 1 ? points[i + 1] : null; // The next point.
        var w = this.evalWidth(i) / 2; // The width of the trail at this point.

        // If we're at the start of the trail, just push the point, because the width will be 0.
        if(!prev) {
          vertices.push(p);
        }
        else {

          // If we're at the end of the trail, assume two points in the same spot.
          if(next == null) {
            next = p;
          }

          // Create a vector that represents the line perpendicular to the
          // line between the previous and next points.
          var v = new Point(next.y - prev.y, next.x - prev.x).normalize();

          // Project two points along the perpendicular vector between and
          // beyond the current point at distance w.
          var a = new Point(p.x - v.x * w, p.y + v.y * w);
          var b = new Point(p.x + v.x * w, p.y - v.y * w);

          // Splice these two points one after the other into the array between
          // the last two points, so we create a closed path.
          vertices.splice(i, 0, a, b);
        }
      }, this);

      // Push the first vertex again to close the shape.
      vertices.push(vertices[0]);

      // Pen the path to the canvas context.
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      vertices.forEach(function(v) {
        ctx.lineTo(v.x, v.y);
      });
    }

    // Fill or stroke the path depending on visualizer setting.
    if(visualize) {
      ctx.stroke();
    }
    else {
      ctx.fill();
    }

    // If in visualizer mode, draw the points as small circles.
    if(visualize) {
      this.points.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }

  // This function returns the width of the path at the specified index.
  this.evalWidth = function(index) {
    return this.width * index / this.points.length;
  }
};

// On mouse move.
function mousemove(e) {
  if(dragging) {
    ball.pos.x = e.offsetX;
    ball.pos.y = e.offsetY;
  }
}

// On mouse down.
function mousedown(e) {
  dragging = true;
  ball.pos.x = e.offsetX;
  ball.pos.y = e.offsetY;
}

// On mouse up.
function mouseup(e) {
  dragging = false;
}

// Update the scene between frames.
function update(timestamp) {
  ball.trail.update(ball.pos, timestamp);
  draw();
  window.requestAnimationFrame(update);
}

// Render the scene.
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.render(ctx);
}

// Initialize the scene.
window.onload = function() {
  canvas = document.getElementById('canvas');

  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ball = new Ball();

  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mousedown", mousedown);
  canvas.addEventListener("mouseup", mouseup);

  draw();

  // Start updating.
  window.requestAnimationFrame(update);
}
