
let Sprite = null;
let background_sprite = [];
let foreground_sprite = [];
let SPRITE_STRIDE = 32;
let SPRITE_SIZE = 31;

let _game = null; // this will be of type OthelloGame

// start of Board
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
//
///////////////////////////// end of board
//

function OthelloGame() {
  this.current_color = BLACK;
  this.board = null;
}

function _findPointerPosition() {
  for (let i=0;i<background_sprite.length;i++) {
    let cs = background_sprite[i];
    if (kontra.pointerOver(cs)) {
      return { row : cs._tonyi, col : cs._tonyj }
    }
  }
  return null;
}

function _init() {
  // cause i am lazy
  Sprite = kontra.Sprite;

  // c is the id of the canvas
  kontra.init("c");

  // needed for mouse interaction
  kontra.initPointer();

  // this is global to the entire game
  kontra.onPointerUp(function(a,b){
    let res = _findPointerPosition();
    if (res!=null) {
      console.log("clicked on space",res);
    } else {
      console.log("got a null from click... :(")
    }
  });

  // game related
  _game = new OthelloGame();

  // make a board
  _game.board = new Board();
  _game.board.clear();
  _game.board.setup();
}

function _create_sprites() {
  for(let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
      // background sprite for board
      let tmp = Sprite({
        x : j*SPRITE_STRIDE,
        y : i*SPRITE_STRIDE,
        color : 'green',
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        _tonyi : i,
        _tonyj : j,
        onUp : function() {
          //console.log("clicked empty space!");
        }
      });
      background_sprite.push(tmp);

      // create sprites for player and computer
      if (_game.board.data[i][j]==WHITE) {
        let tmp = Sprite({
          x : j*SPRITE_STRIDE,
          y : i*SPRITE_STRIDE,
          color: "white",
          width:SPRITE_SIZE,
          height:SPRITE_SIZE
        });
        foreground_sprite.push(tmp);
      } else if (_game.board.data[i][j]==BLACK) {
        let tmp = Sprite({
          x : j*SPRITE_STRIDE,
          y : i*SPRITE_STRIDE,
          color: "black",
          width:SPRITE_SIZE,
          height:SPRITE_SIZE
        });
        foreground_sprite.push(tmp);
      }
    }
  }
  
  // need to call track
  // if you want pointer interactions
  kontra.track(background_sprite); // track all the background sprites
}

function main() {
  
    _init(); // setup everything for kontra

    _create_sprites();

    let loop = kontra.GameLoop({  // create the main game loop
      
      update: function() { // update the game state


      },
      
      render: function() { // render the game state
        for (let i=0;i<background_sprite.length;i++) {
          background_sprite[i].render();
        }
        for (let i=0;i<foreground_sprite.length;i++) {
          foreground_sprite[i].render();
        }
      }

    });

    loop.start();    // start the game
}

window.onload = main;