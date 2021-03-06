import Vector from "./Vector.js";

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 16 * 50;
canvas.height = 9 * 50;
canvas.oncontextmenu = (e) => {
  e.preventDefault();
};
var ctx = canvas.getContext('2d');

var img = new Image()
img.src = './new-shoes-2-copy-test.png';

mainDiv.append(canvas);

var transX = 0;
var transY = 0;

var startDrag = new Vector(0, 0);
var endDrag = new Vector(0, 0);

var dragOffset = endDrag.subtract(startDrag);
var PreviousDragOffset = dragOffset;

var scale = 1;


loop();
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.beginPath();
  ctx.translate(transX + dragOffset.x, transY + dragOffset.y);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  ctx.rect(0, 0, 10, 10);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.restore();

}

function loop() {
  window.requestAnimationFrame(loop);
  draw();
}

canvas.addEventListener('wheel', disableScroll);

canvas.addEventListener('mousedown', handleMouseDown);

canvas.addEventListener('mouseup', () => {
  PreviousDragOffset = dragOffset;
  canvas.removeEventListener('mousemove', move);
})

function handleMouseDown(e) {
  if(e.shiftKey && e.button === 0) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
  
    startDrag = new Vector(mouseX, mouseY);

    canvas.addEventListener('mousemove', move);
  }
}

function move(e) {
  if(e.shiftKey && e.button === 0) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
  
    endDrag = new Vector(mouseX, mouseY);
  
    var startAndEndDragDifference = endDrag.subtract(startDrag);
  
    var newDragOffset = PreviousDragOffset.add(startAndEndDragDifference)
  
    dragOffset = newDragOffset;

    if(dragOffset.x >= 0) {
      dragOffset.x = 0;
    }

    if(dragOffset.x + (img.width * scale)  <= canvas.width) {
      dragOffset.x = canvas.width - (img.width * scale);
    }

    if(dragOffset.y >= 0) {
      dragOffset.y = 0;
    }

    if(dragOffset.y + (img.height * scale) <= canvas.height) {
      dragOffset.y = canvas.height - (img.height * scale);
    }
  }
}

function handleZoom(e) {

  var rect = canvas.getBoundingClientRect();
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top;

  /*
    The code below is from this Stackoverflow thread - 
    https://stackoverflow.com/questions/49245168/zoom-in-out-at-mouse-position-in-canvas 
    thank you Amir
  */
  var direction = e.deltaY > 0 ? -1 : 1;
  var factor = 0.2;
  var zoom = 1 * direction * factor;

  var wx = (mouseX - dragOffset.x) / (canvas.width * scale);
  var wy = (mouseY - dragOffset.y) / (canvas.height * scale);

  dragOffset.x -= wx * canvas.width * zoom;
  dragOffset.y -= wy * canvas.height * zoom;

  scale += zoom;

  if(scale < 1) {
    scale = 1;
  }
  

  if(dragOffset.x >= 0) {
    dragOffset.x = 0;
  }

  if(dragOffset.x + (img.width * scale)  <= canvas.width) {
    dragOffset.x = canvas.width - (img.width * scale);
  }

  if(dragOffset.y >= 0) {
    dragOffset.y = 0;
  }

  if(dragOffset.y + (img.height * scale) <= canvas.height) {
    dragOffset.y = canvas.height - (img.height * scale);
  }

}

function disableScroll(e) {
  handleZoom(e)
  return e.preventDefault();
}