
let balls = [];
let sprites = [];

const BALL_MIN_RADIUS = 10
const BALL_START_VELOCITY = 1

const PEGS_POS_X = 30
const PEGS_POS_Y = 180
const PEGS_DISTANCE = 63
const MAX_BALLS = 5
const TILE_SIZE = 95
const COLOR_AMBER = '#FFBF00'
const COLOR_GREEN = '#33ff33'


////////////////////////////////////////////////////
// helper

var degreesToRadians = function (deg) {
    return deg * Math.PI / 180;
  }
  
  function lerp (min, max, t) {
      return min * (1-t) + max * t
  }
  
  function damp (a, b, lambda, dt) {
      return lerp(a, b, 1 - Math.exp(-lambda * dt))
  }
  
  function clamp (val, a, b) {
      if (a < b) {
          return Math.max(a, Math.min(b, val)) 
      } else {
          return Math.max(b, Math.min(a, val)) 
      }
  }
  
  // Hundreds Helper Functions
  var normalize = function (n) {
      var magnitude = Math.sqrt(n.x*n.x + n.y*n.y)
      n = {
          x: n.x / magnitude,
          y: n.y / magnitude
      }
      return n
  }
  
  var dotProduct = function (v1, v2) {
      // The dot product is the sum of products of the vector elements, so for two 2D vectors v1=(dx1,dy1) and v2=(dx2,dy2) the Dot Product is:
      // Dot(v1,v2)=(dx1*dx2)+(dy1*dy2)
      return v1.x * v2.x + v1.y * v2.y
  }
  
////////////////////////////////////////////////////
////////////////////////////////////////////////////

function Ball() {
    this.type = 'ball';
    this.radius = 12;
    this.width =  2 * BALL_MIN_RADIUS;
    this.height =2 * BALL_MIN_RADIUS;
    this.color= COLOR_AMBER;
    this.value= 10;
    this.dy= 0;
    this.dx= 0;
    this.maxVelocity= 10;
    this.ddy= 0.06;
    this.friction= 0.005;
}
Ball.prototype = {
    bounceOff(object) {
        // http://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php?page=3
        const v1 = { x: this.dx, y: this.dy }
        const v2 = { x: object.dx, y: object.dy }
        var n = normalize ({ x: this.x - object.x, y: this.y - object.y })
        var a1 = dotProduct(v1, n)
        var a2 = dotProduct(v2, n)
    
        var optimizedP = (2.0 * (a1 - a2)) / (this.mass + object.mass);
    
        this.dx = v1.x - optimizedP * object.mass * n.x
        this.dy = v1.y - optimizedP * object.mass * n.y
        
        object.dx = v2.x + optimizedP * this.mass * n.x
        object.dy = v2.y + optimizedP * this.mass * n.y
        
        // OPTIONAL Do sparks at the midpoint
        var midpoint = {
            x: this.x + (object.x - this.x) * this.radius / object.radius,
            y: this.y + (object.y - this.y) * this.radius / object.radius
        };
        //doSpark(midpoint.x, midpoint.y, a1, this.color)
        //doSpark(midpoint.x, midpoint.y, a2, object.color)    
    },
    collidesWith(object) {
        let dx = this.x - object.x;
        let dy = this.y - object.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + object.radius;
    },
    render(dt) {
        kontra.context.save()
        // Circle
        kontra.context.strokeStyle = this.color;
        kontra.context.beginPath();
        kontra.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        kontra.context.stroke()

        // Text
        if (this.value > 0) {
            kontra.context.fillStyle = this.color;
            this.context.font = (this.radius) + 'px Courier New'
            this.context.textBaseline = 'middle'
            let displayValue = Math.floor(this.value*10)/10;
            kontra.context.fillText(displayValue, this.x - 0.6*this.radius, this.y)
        }
        kontra.context.restore()
    },
    update(dt) {
        //if (!this.released && kontra.pointer.pressed('left')) {
        //    this.x = kontra.pointer.x
        //    if (!this.lastPosition) this.lastPosition = {x:this.x, y:this.y}
        //    this.dx = this.x - this.lastPosition.x
        //    this.dy = this.y - this.lastPosition.y
        //    this.lastPosition = {x:this.x, y:this.y}
        //} else {
            if (!this.released) {
                this.ttl = 20 * 60;
                // Add a little jitter to prevent same drops
                this.dx = Math.random() * 0.2 - 0.1
                this.dy = Math.random() * 0.2 - 0.1
            }
            this.released = true
            this.advance()
        //}
        this.mass = Math.PI * this.radius * this.radius
    
        // Cap the velocity
        let velocity = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
        if (velocity > this.maxVelocity) {
            this.dx *= this.maxVelocity / velocity
            this.dy *= this.maxVelocity / velocity
        }
    
        let n = normalize({x:this.dx, y:this.dy})
    
        // friction
        if (this.friction && this.released) {
            this.dx *= (1 - this.friction)
            this.dy *= (1 - this.friction)
        }
    
        if (this.x - this.radius < 0) {
            this.dx = Math.abs(this.dx)
            this.x = this.radius
        }
        if (this.x + this.radius > kontra.canvas.width){
            this.dx = -1 * Math.abs(this.dx)
            this.x = kontra.canvas.width - this.radius
        }
        if (this.y - this.radius < 0) {
            this.dy = Math.abs(this.dy)
            this.y = this.radius
        }
        if (this.y - this.radius > kontra.canvas.height) {
            // before tony
            //this.ttl = -1;

            // this causes the balls to bounce
            // below the line a bit (to the radius i think)
            //this.dy = -1 * Math.abs(this.dy);
            this.dy = -1 * Math.abs(this.dy) - this.friction;
            
            this.y = kontra.canvas.height - this.radius



        }
    }
}


function main() {
    let {canvas,context} = kontra.init("c");
    
    // this is weird that i am doing this?
    // lib should do it?
    kontra.canvas = canvas;
    kontra.context = context;

    // needed for mouse interaction
    kontra.initPointer();

    for(let i=0;i<3;i++) {
        let tmp = new Ball();
        tmp.x = Math.random() * kontra.canvas.width;
        balls.push(tmp);
        sprites.push(kontra.Sprite(tmp));
    }
    let loop = kontra.GameLoop({
        fps: 60,
        update(dt) {
            for (let i = 0; i < balls.length-1; i++) {
                for (let j = i+1; j < balls.length; j++) {
                    balls[i].bounceOff(balls[j]);
                }
            }
            
            for (let i=0;i<sprites.length;i++) {
                sprites[i].update(dt);
            }
        },
        render() {
            context.fillRect(0,0,canvas.width,canvas.height);
            //kontra.context.fillRect(0,0,kontra.canvas.width, kontra.canvas.height)

            for (let i=0;i<sprites.length;i++) {
                sprites[i].render();
            }


        }
    }); // end of game loop
    loop.start();
    
}

window.onload = main;