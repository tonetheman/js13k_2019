
let canvas = null, context = null;

let sprite = null;
let a = null;

  let loop = kontra.GameLoop({  // create the main game loop
    update: function() { // update the game state
      //sprite.update();
  
      // wrap the sprites position when it reaches
      // the edge of the screen
      if (sprite.x > canvas.width) {
        sprite.x = -sprite.width;
      }
      if (a) {
          a.update();
      }
      //a.update();
    },
    render: function() { // render the game state
      //sprite.render();
      if (a) {
          a.render();
      }
      
    }
  });

function mainline() {
    //console.log(kontra);
    let res = kontra.init();
    canvas = res.canvas;
    context = res.context;
    sprite = kontra.Sprite({
        x: 100,        // starting x,y position of the sprite
        y: 80,
        color: 'red',  // fill color of the sprite rectangle
        width: 20,     // width and height of the sprite rectangle
        height: 40,
        dx: 2          // move the sprite 2px to the right every frame
      });
    
      let spriteSheet = null;

      kontra.load("a09180604040300.png").then(function(){
          console.log("about to create spritesheet...");
          console.log(kontra);
        spriteSheet = kontra.SpriteSheet({
            image : kontra.imageAssets.a09180604040300,
            frameWidth : 16,
            frameHeight : 16,
            animations : {
                idle : {
                    frames: [0]
                    //frameRate: 30
                }
            }
        });

        console.log("loading... a...")
        // make a sprite
        a = kontra.Sprite({
            width : 16,
            height : 16,
            x : 50, y : 50,
            animations : spriteSheet.animations
        });
        a.playAnimation("idle");

      });
    loop.start();
}

window.onload = mainline;