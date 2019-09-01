let W = 448;
let H = 667;
let context = null, canvas = null;
let sprites = [];
let FOV = 60 // 60 degrees field of view

// in the example this number was really low?
let MAX_CAST_RANGE = W // max amount to cast the ray

// EACH MAP square is 64px across 7*64 = 448
// 10 rows = 640px of data
let map = [
    [0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
];
let player = null; // will be a kontra sprite
let game_map = null;

class GameMap {
    constructor(mapdata) {
        this.mapdata = mapdata;
    }
    get(x,y) {
        return this.mapdata[x][y];
    }
}

function _setup_sprites() {
    let tmp = kontra.Sprite({
        x : 0,
        y : 0,
        width : 64,
        height : 64,
        color : "red"
    });
    sprites.push(tmp);

    player = kontra.Sprite({
        x : 4*64 + (0.5*64),
        y : 640,
        anchor : { x : 0.5, y : 0.5 },
        width : 64,
        height : 64,
        color : "blue",
        // custom property
        direction : 90 // in degrees
    });
    sprites.push(player);

}

function _init() {
    let tmp = kontra.init("c");
    context = tmp.context;
    canvas = tmp.canvas;
    
    //console.log("canvas and context",canvas,context);

    // needed for mouse interaction
    kontra.initPointer();  
    // needed for keys
    kontra.initKeys();

    _setup_sprites();

    game_map = new GameMap(map);
}

function _update_sprites() {
    for(let i=0;i<sprites.length;i++) {
        sprites[i].update();
    }
}

class Point {
    constructor(point) {
        this.x = point.x;
        this.y = point.y;
        this.height = 0;
        this.distance = 0;
        this.shading = 0;
        if (point.length) {
            this.length = point.length;
        } else {
            this.length = 0;
        }
    }
    step(rise,run,invert) {
        let x = null, y = null;
        if (invert) {
            x = this.y;
            y = this.x;
        } else {
            x = this.x;
            y = this.y;    
        }
        let dx = null;
        if (run>0) {
            dx = Math.floor(x+1)-x;
        } else {
            dx = Math.ceil(x-1)-x;
        }
        let dy = dx * (rise/run);
        let next_x = null, next_y = null;
        if (invert) {
            next_x = x+dy;
            next_y = y+dx;  
        } else {
            next_x = x+dx;
            next_y = y+dy;    
        }
        let length = Math.hypot(dx,dy);
        return new Point({x:next_x,y:next_y,length:length});
    }
    inspect(info,game_map,shift_x,shift_y,distance,offset) {
        let dx = null, dy = null;
        if (info.cos<0) {
            dx = shift_x;
        } else {
            dx = 0;
        }
        if (info.sin<0) {
            dy = shift_y;
        } else {
            dy = 0;
        }
        console.log("inspect:",this.x,dx,this.y,dy);
        this.height = game_map.get(this.x-dx, this.y-dy);
        this.distance = distance+this.length;
        if (shift_x) {
            if (info.cos<0) {
                this.shading = 2;
            } else {
                this.shading = 0;
            }
        } else {
            if (info.sin<0) {
                this.shading = 2;
            } else {
                this.shading = 1;
            }
        }
        this.offset = offset-Math.floor(offset);
        return this;
    }
}

function cast_ray(point,angle,cast_range) {
    console.log("cast_ray",point,angle,cast_range);

    let info = { sin : Math.sin(angle),
        cos : Math.cos(angle)};
    let origin = new Point(point);
    let ray = [origin];
    while ((origin.height <= 0) && (origin.distance <= cast_range)) {
        let dist = origin.distance;
        let step_x = origin.step(info.sin, info.cos,false);
        let step_y = origin.step(info.cos, info.sin,true);
        console.log("step x and y ", step_x, step_y);
        let next_step = null;
        if (step_x.length < step_y.length) {
            next_step = step_x.inspect(info,game_map,1,0,dist,step_x.y);
        } else {
            next_step = step_y.inspect(info,game_map,0,1,dist,step_y.x)
        }
        console.log("next step is set to",next_step);
        ray.push(next_step);
        origin = next_step;
    }
    return ray;
}

function _render_sprites() {
    for(let i=0;i<sprites.length;i++) {
        sprites[i].render();
    }

    // for each slice in the resolution
    // the width
    /*
    for(let i=0;i<W;i++) {
        let angle = FOV*(i/W-0.5)
        let point = {x:player.x,y:player.y};
        let ray = cast_ray(point,player.direction+angle,MAX_CAST_RANGE)
    }
    */
}

function main() {
    console.log("main has started...");
    _init();
    let loop = kontra.GameLoop({
        update() {
            _update_sprites();
        },
        render() {
            _render_sprites();
        }
    });
    console.log("loop is starting...");
    loop.start();

    cast_ray({x:288,y:640},60,448);
}

window.onload = main;