

let context = null;
let W = 375, H = 667;
let pixelsPerBlock = 8;

// see here: 
/*
https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
*/

let mapdata = [
//[1,0,x,x,x,0,1],
[1,1, 1,1,1, 1,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1]
];

function drawMap() {
    for(let i=0;i<mapdata.length;i++) {
        for (let j=0;j<mapdata[0].length;j++) {
            
        }
    }
}

function _init() {
    // c is the id of the canvas
    let tmp = kontra.init("c");
    context = tmp.context;
    canvas = tmp.canvas;

    // needed for mouse interaction
    kontra.initPointer();  
  }
  

function main() {
    _init();
    
    let loop = kontra.GameLoop({ 
        update: function() { 
        },      
        render: function() {
            context.fillRect(0,0,
                canvas.width, canvas.height);
            drawMap();
        }  
    });
    loop.start();    // start the game
}

window.onload = main;
