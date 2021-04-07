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
img.src = 'belle delphine 3.jpg';

mainDiv.append(canvas);
mainDiv.append(img);

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
  // ctx.scale(scale, scale);
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

canvas.addEventListener('wheel', disableScroll)

canvas.addEventListener('mousedown', handleMouseDown);

canvas.addEventListener('mouseup', () => {
  PreviousDragOffset = dragOffset;
  canvas.removeEventListener('mousemove', move);
})

function handleMouseDown(e) {
  if(e.shiftKey && e.button === 0) {
    var rect = canvas.getBoundingClientRect();
    console.log(rect);
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
  
    startDrag = new Vector(mouseX, mouseY);

    console.log(e);
  
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
  }
}

function handleZoom(e) {

  if(Math.sign(e.deltaY) === -1) {

    scale += 0.05;

  } else if(Math.sign(e.deltaY) === 1) {
    if(scale > 1) {
      scale -= 0.05;
  } else {
      scale = 1;
    }
  }

  console.log(e);

}

function disableScroll(e) {
  handleZoom(e)
  return e.preventDefault();
}