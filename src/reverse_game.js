
let init = null, Sprite = null, GameLoop = null;
let canvas = null, context = null;
let board = null;
let background_sprite = [];
let foreground_sprite = [];

let EMPTY = 0;
let WHITE = 1;
let BLACK = 2;

function Board() {
  this.data = [];
  for (let i=0;i<8;i++) {
    let tmp = [];
    for (let j=0;j<8;j++) {
      tmp.push(0);
    }
    this.data.push(tmp);
  }
}
Board.prototype = {
  clear() {
    for(let i=0;i<8;i++) {
      for (let j=0;j<8;j++) {
        this.data[i][j] = EMPTY;
      }
    }
  },
  setup() {
    this.data[3][3] = WHITE;
    this.data[4][4] = WHITE;
    this.data[3][4] = BLACK;
    this.data[4][3] = BLACK;
  }
}

function _init() {
  init = kontra.init;
  Sprite = kontra.Sprite;
  GameLoop = kontra.GameLoop;
  let tmp = init("c");

  kontra.initPointer();

  canvas = tmp.canvas;
  context = tmp.context;

  // game related
  board = new Board();
  board.clear();
  board.setup();
}

function _create_sprites() {
  for(let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
      let tmp = Sprite({
        x : j*16,
        y : i*16,
        color : 'green',
        width: 15,
        height: 15,
        onUp : function() {
          console.log("clicked empty space!");
        }
      });
      background_sprite.push(tmp);

      // create sprites for player and computer
      if (board.data[i][j]==WHITE) {
        let tmp = Sprite({
          x : j*16,
          y : i*16,
          color: "white",
          width:15,
          height:15
        });
        foreground_sprite.push(tmp);
      } else if (board.data[i][j]==BLACK) {
        let tmp = Sprite({
          x : j*16,
          y : i*16,
          color: "black",
          width:15,
          height:15
        });
        foreground_sprite.push(tmp);
      }
    }
  }
}

function main() {
  
    _init(); // setup everything for kontra

    _create_sprites();

    // red sprite here
    /*
    let sprite = Sprite({
        x: 100,        // starting x,y position of the sprite
        y: 80,
        color: 'red',  // fill color of the sprite rectangle
        width: 20,     // width and height of the sprite rectangle
        height: 40,
        dx: 2          // move the sprite 2px to the right every frame
      });
    */
      let loop = GameLoop({  // create the main game loop
        update: function() { // update the game state
          
          
          // red sprite updates here
          // sprite.update();
      
          // wrap the sprites position when it reaches
          // the edge of the screen
          //if (sprite.x > canvas.width) {
          //  sprite.x = -sprite.width;
          //}
        },
        render: function() { // render the game state
          for (let i=0;i<background_sprite.length;i++) {
            background_sprite[i].render();
          }
          for (let i=0;i<foreground_sprite.length;i++) {
            foreground_sprite[i].render();
          }
          // red sprite
          //sprite.render();
        }
      });
      
      loop.start();    // start the game
}

window.onload = main;