let last = null;
let C = null; // canvas
let CTX = null; // main context
let game = null;
let W = 340, H = 280; // needs to match canvas
let _1SECOND = 60
let EMPTY = 0;
let GROUND = 1;
let G_GRAV = 0.05; // super slow for debug
let _keymap = {};
let K_LEFT = 37;
let K_RIGHT = 39;
let K_UP = 38;

class Player {
    constructor() {
        this.x = 0; //pos
        this.y = 0;
        this.dx = 0; // velocity
        this.dy = 0;
        this.ground = false;
        this.jumpvel = 8; // not sure about this yet
    }
    update() {

    }
    draw() {
        CTX.fillStyle = "#00f";
        CTX.fillRect(this.x,this.y,15,15);
    }
}

class Map {
    constructor() {
        this.data = [];
        for (let i=0;i<10;i++) {
            let tmp = []
            for (let j=0;j<10;j++) {
                tmp.push(EMPTY);
            }
            this.data.push(tmp);
        }
    }
    fake() {
        for (let i=0;i<10;i++) {
            this.data[9][i]=GROUND;
        }
    }
    get(row,col) {
        return this.data[row][col];
    }
    draw() {
        for (let i=0;i<10;i++) {
            for (let j=0;j<10;j++) {
                let v = this.data[i][j];
                if (v==EMPTY) {
                    CTX.fillStyle = "#000";
                } else if (v==GROUND) {
                    CTX.fillStyle = "#0f0";
                }
                
                CTX.fillRect(j*16,i*16,15,15);
            }
        }
    }
}

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        // backup in time coords
        // not sure this is going to work hahah
        this._oldx = 0;
        this._oldy = 0;
        this._old_dx = 0;
        this._old_dy = 0;
    }
    draw() {

    }
    update(dt) {

    }
    clicked(pointerx,pointery) {
        if (
            (pointerx>=this.x) && (pointerx<=(this.x+this.width))
            && (pointery>=this.y) && (pointery<=(this.y+this.height))
        ) {
            return true;
        }
        return false;
    }
}

class BaseState {
    constructor() {}
    enter() {}
    exit() {}
    update() {}
    draw() {}
}

class GameLoading extends BaseState {
    constructor() {
        super();
        this.counter = 0;
    }
    enter() {
        console.log("loading state enter");
    }
    exit() {
        console.log("loading state exit");
    }
    update() {
        this.counter++;
        if (this.counter>_1SECOND) {
            game.changeState("playing");
        }
    }
    render() {

    }
}

class GamePlaying extends BaseState {
    constructor() {
        super();
        this.player = new Player();
        this.map = new Map();
        this.map.fake(); // setup a ground
    }
    enter() {
        console.log("game playing started...");
    }
    draw() {
        //
        CTX.clearRect(0,0,W,H);
        this.map.draw();
        this.player.draw();
    }
    update(dt) {
        // save our spot
        let start_x = this.player.x;

        if (_keymap[K_UP] && this.player.ground) {
            this.player.dy -= this.player.jumpvel
        }

        this.player.dx = 0;

        // LEFT AND RIGHT KEY PRESSES
        if (_keymap[K_LEFT]) {
            this.player.dx -= 2;
        }
        if (_keymap[K_RIGHT]) {
            this.player.dx += 2;
        }

        // now move the player left/right
        this.player.x += this.player.dx;

        // TODO: check for walls? no clue
        // maybe just move back to startx pos...

        // add grav
        this.player.dy += G_GRAV;

        // now move in y direction
        this.player.y += this.player.dy;
        
        let _col = Math.floor(this.player.x/16);
        // this is the row below the player
        let _row = Math.floor(this.player.y/16)+1;
        
        this.player.ground = false; // assume it is not

        // only check if moving down
        if (this.player.dy >= 0) {
            if ((_row!==undefined) || (_col!==undefined)) {

                let val = this.map.data[_row][_col];
                if (val!=0) {

                    //this.player.y = _row*16;
                    // stop moving down
                    this.player.y = (_row * 16)-16;
                    this.player.dy = 0;
                    this.player.ground = true;
                }    
            }
        }

        // TODO:
        // check if tile above player is solid?

        // only check if moving up
        if (this.player.dy < 0) {

            // compute where you end up
            // should i save y

            // stop moving up
            this.player.dy = 0;
        }
    }
}
class Game {
    constructor() {
        this.currentState = null;
        this.states = [];
    }
    update(dt) {
        if (this.currentState) {
            this.currentState.update(dt);
        }
    }
    draw() {
        if (this.currentState) {
            this.currentState.draw();
        }
    }
    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = this.states[newState];
        if (this.currentState) {
            this.currentState.enter();
        }
    }
}
function loadAllImages() {
    let a = [];
    a.push(new Promise(function(res,rej) {
        let i1 = new Image();
        i1.src = "/assets/littledude.png";
        i1.onload = function() {
            res({"name":"player",img:i1});
        }
        i1.onerror = function(e) {
            rej("could not load i1");
        }
    }));
    a.push(new Promise(function(res,rej){
        let i2 = new Image();
        i2.src = "/assets/ground.png";
        i2.onload = function() {
            res({"name":"ground",img:i2});
        }
        i2.onerror = function(e) {
            rej("could not load i2");
        }
    }));
    return Promise.all(a);
}
function _keydownHandler(e) {
    _keymap[e.which] = true;
}
function _keyupHandler(e) {
    _keymap[e.which] = false;
}
function _blurHandler() {
    _keymap = {};
}
function _init() {
    C = document.getElementById("c");
    CTX = C.getContext("2d");
    loadAllImages();
    window.addEventListener("keydown", _keydownHandler);
    window.addEventListener("keyup", _keyupHandler);
    window.addEventListener("blur",_blurHandler);
    game = new Game();
    game.states["loading"] = new GameLoading();
    game.states["playing"] = new GamePlaying();
    game.changeState("loading");
}
function _update(dt) {
    game.update(dt);
}
function _draw() {
    game.draw();
}
function frame(dx) {
    if (last==null) {
        last = 0;
    }
    let diff = dx-last;
    _update(diff);
    _draw();
    last = dx;
    requestAnimationFrame(frame);
}
function main() {
    _init();
    frame(0);
}
