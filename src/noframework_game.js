

let G_GRAV = 4;

class Player {
    constructor() {
        this.x = 0; //pos
        this.y = 0;
        this.dx = 0; // velocity
        this.dy = 0;
        this.ground = false;
        this.jumpvel = 2; // not sure about this yet
    }
}

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
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
    }
    enter() {
        console.log("loading state enter");
    }
    exit() {
        console.log("loading state exit");
    }
    update() {

    }
    render() {

    }
}

class GamePlaying extends BaseState {
    constructor() {
        super();
        this.player = new Player();
    }
    update(dt) {
        // save our spot
        let start_x = this.player.x;

        // TODO: if we have a button press
        // change vel now!
        // if buttonPress && this.player.ground
        // this.player.dy -= this.player.jumpvel

        this.player.dx = 0;
        // TODO if we have a left or right press
        // if buttonPress left
        // this.player.dx -= 2;
        // if buttonPress right
        // this.player.dx += 2;

        // TODO:
        // now move the player left/right
        this.player.x += this.player.dx;

        // TODO: check for walls? no clue
        // maybe just move back to startx pos...

        // add grav
        this.player.dy += G_GRAV;

        // now move in y direction
        this.player.y += this.player.dy;

        // TODO:
        // need to check the tile under the player
        // is it solid?

        this.player.ground = false; // assume it is not

        // only check if moving down
        if (this.player.dy) > 0 {

            // compute where you end up
            // should i save y?

            // stop moving down
            this.player.dy = 0;
        }

        // TODO:
        // check if tile above player is solid?

        // only check if moving up
        if (this.player.dy) < 0 {

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