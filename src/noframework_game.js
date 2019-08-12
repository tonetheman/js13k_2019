

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