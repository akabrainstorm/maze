var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var w = document.getElementById('w');
var h = document.getElementById('h');

var rows = [];
var size = 20;
var width = 10;
var height = 10;

var current = { x: 0, y: 0 };

function init() {
    rows = [];
    for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < width; x++) {
            row.push({ visited: false, top: true, right: true, bottom: true, left: true });
        }
        rows.push(row);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        for (var x = 0; x < row.length; x++) {
            var cell = row[x];
            var cx = x * size;
            var cy = y * size;
            ctx.beginPath();
            if (cell.top) {
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + size, cy);
            }
            if (cell.right) {
                ctx.moveTo(cx + size, cy);
                ctx.lineTo(cx + size, cy + size);
            }
            if (cell.bottom) {
                ctx.moveTo(cx + size, cy + size);
                ctx.lineTo(cx, cy + size);
            }
            if (cell.left) {
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx, cy + size);
            }
            ctx.stroke();
        }
    }
}

function setWall(x, y, wall, value) {
    rows[y][x][wall] = value;
    if (wall == "top" && y > 0) {
        rows[y-1][x].bottom = value;
    } else if (wall == "right" && x < width - 1) {
        rows[y][x+1].left = value;
    } else if (wall == "bottom" && y < height - 1) {
        rows[y+1][x].top = value;
    } else if (wall == "left" && x > 0) {
        rows[y][x-1].right = value;
    }
}

function getNeighbors(x, y) {
    var neighbors = [];
    if (y > 0)
        if (!rows[y-1][x].visited)
            neighbors.push({ x: x, y: y-1, dir: "top" });

    if (x < width - 1)
        if (!rows[y][x+1].visited)
            neighbors.push({ x: x+1, y: y, dir: "right" });

    if (y < height - 1)
        if (!rows[y+1][x].visited)
            neighbors.push({ x: x, y: y+1, dir: "bottom" });

    if (x > 0) {
        if (!rows[y][x-1].visited)
            neighbors.push({ x: x-1, y: y, dir: "left" });
    }
    return neighbors;
}

function isDone() {
    for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        for (var x = 0; x < row.length; x++) {
            var cell = row[x];
            if (!cell.visited) return false;
        }
        
    }
    return true;
}

var lastframe = 0;
var timeForAnimate = 0.2;
var stack = [];
var animating = false;

function animate(timestamp) {
    var dt = (timestamp - lastframe) / 1000;
    lastframe = timestamp;
    timeForAnimate -= dt;

    if (timeForAnimate <= 0) {
        timeForAnimate = 0.2;
        var neighbors = getNeighbors(current.x, current.y);
        if (neighbors.length > 0) {
            var neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push({x: current.x, y: current.y });
            setWall(current.x, current.y, neighbor.dir, false);
            rows[neighbor.y][neighbor.x].visited = true;
            current.x = neighbor.x;
            current.y = neighbor.y;
        } else if(stack.length > 0) {
            var cell = stack.pop();
            current.x = cell.x;
            current.y = cell.y;
        } else {
            console.log("DONE");
            draw();
            animating =  false;
            return;
        }
        draw();
        for (var i = 0; i < stack.length; i++) {
            var cell = stack[i];
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cell.x * size+5, cell.y * size+5, 10, 10);
        }
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(current.x * size+5, current.y * size+5, 10, 10);
        /*for (var y = 0; y < rows.length; y++) {
            var row = rows[y];
            for (var x = 0; x < row.length; x++) {
                var cell = row[x];
                if (!cell.visited) continue;
                ctx.fillStyle = "red";
                ctx.fillRect(x * size + 5, y * size + 5, 10, 10);
            }
        }*/
    }
    requestAnimationFrame(animate);
}

function start() {
    if(animating) return;
    animating = true;

    width = w.valueAsNumber;
    height = h.valueAsNumber;

    init();
    current.x = 0;
    current.y = 0;
    stack = [];

    rows[0][0].visited = true;
    requestAnimationFrame(animate);
}