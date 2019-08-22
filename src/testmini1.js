

let context = null;
let W = 375, H = 667;
let pixelsPerBlock = 8;
let sprites = [];
let BASESIZE=28;
let player = null;

// see here: 
/*
https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
*/

let mapdata = [
//[1,0,x,x,x,0,1],
[1,1, 1,1,1, 1,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,1,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,1,0, 0,1],
[1,0, 0,0,0, 0,1],
[1,0, 0,1,0, 0,1],
[1,0, 0,1,0, 0,1],
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
    sprites = [];
    for(let i=0;i<mapdata.length;i++) {
        for (let j=0;j<mapdata[0].length;j++) {
		let val = mapdata[i][j];
		if (val>0) {
			let tmp = new kontra.Sprite({
				x : j*BASESIZE,
				y : i*BASESIZE,
				width: BASESIZE-1,
				height: BASESIZE-1,
				color: "red"
            });
            sprites.push(tmp);
		} else {
			let tmp  = new kontra.Sprite({
				x : j*BASESIZE,
				y : i*BASESIZE,
				width : BASESIZE-1,
				height : BASESIZE-1,
				color: "blue"
            });
            sprites.push(tmp);
		}            
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
    // needed for keys
    kontra.initKeys();

    player = kontra.Sprite({
        x : 100, y : 100,
        width : 4, height: 4,
        color : "white",
        rotation : 0,
        update() {
            /*
            TODO: this is asteroids movement
             NOT RIGHT
             */
            if (kontra.keyPressed("left")) {
                this.rotation += 1;
            }
            if (kontra.keyPressed("right")) {
                this.rotation -= 1;
            }
            let cos = Math.cos(this.rotation);
            let sin = Math.sin(this.rotation);
            if (kontra.keyPressed("up")) {
                this.ddx = cos * 0.05;
                this.ddy = sin * 0.05;
            } else {
                this.ddx = this.ddy = 0;
            }

            this.advance();

            let mag = Math.sqrt(this.dx * this.dx + this.dy*this.dy);
            if (mag>5) {
                this.dx *= 0.95;
                this.dy *= 0.95;
            }
        }
    });
  }
  
function clearC() {
    context.fillRect(0,0,canvas.width, canvas.height);
}

function main() {
    _init();
    // create sprites just once
    drawMap();

    let loop = kontra.GameLoop({ 
        update: function() {
            player.update();
        },      
        render: function() {
            clearC();

            for (let i=0;i<sprites.length;i++) {
                sprites[i].render();
            }

            player.render();
        }  
    });
    loop.start();    // start the game
}

window.onload = main;
