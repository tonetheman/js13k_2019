

function _init() {
    // c is the id of the canvas
    let tmp = kontra.init("c");
    // needed for mouse interaction
    kontra.initPointer();  
  }
  

function main() {
    _init();
    
    let loop = kontra.GameLoop({ 
        update: function() { 
        },      
        render: function() { 
        }  
    });
    loop.start();    // start the game
}

window.onload = main;