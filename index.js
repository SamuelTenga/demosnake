// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Sam's Snake ",      
    color: "#f59b25", 
    head: "beluga",  
    tail: "skinny", 
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  var boardWidth = gameState.board.width;
  var boardHeight = gameState.board.height;
  if (myHead.y == 1) {        // Neck is left of head, don't move left
    isMoveSafe.down = false;

  } else if (myHead.y == boardHeight-1) { // Neck is right of head, don't move right
    isMoveSafe.up = false;

  } else if (myHead.x == boardWidth-1) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myHead.x == 1) { // Neck is above head, don't move up
    isMoveSafe.left = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  var myBody = gameState.you.body;
  console.log(myBody);
  let nextMoveUp = {
    x: myHead.x,
    y: myHead.y+1
  };
  let nextMoveDown= {
    x: myHead.x,
    y: myHead.y-1
  };
  let nextMoveLeft= {
    x: myHead.x+1,
    y: myHead.y
  };
  let nextMoveRight= {
    x: myHead.x-1,
    y: myHead.y
  };


  let isUpUnsafe = myBody.filter(element => {
    if(element.x === nextMoveUp.x && element.y === nextMoveUp.y){
      return true;
    }
    return false;
  });
  
  let isDownUnsafe = myBody.filter(element => {
    if(element.x === nextMoveDown.x && element.y === nextMoveDown.y){
      return true;
    }
    return false;
  });

    
  let isLeftUnsafe = myBody.filter(element => {
    if(element.x === nextMoveLeft.x && element.y === nextMoveLeft.y){
      return true;
    }
    return false;
  });

  let isRigihtUnsafe = myBody.filter(element => {
    if(element.x === nextMoveRight.x && element.y === nextMoveRight.y){
      return true;
    }
    return false;
  });
  console.log(isUpUnsafe);
  console.log(isDownUnsafe);
  console.log(isLeftUnsafe);
  console.log(isRigihtUnsafe);

  if(isUpUnsafe.length == 1){
    isMoveSafe.up = false;
  }

  if(isDownUnsafe.length == 1){
    isMoveSafe.down = false;
  }

  if(isLeftUnsafe.length == 1){
    isMoveSafe.left = false;
  }

  if(isRigihtUnsafe.length == 1){
    isMoveSafe.right = false;
  }

  console.log(`isUpSafe ${isUpUnsafe}, nextMoveUp=> x: ${nextMoveUp.x} y: ${nextMoveUp.y}`);
  console.log(`isDownSafe ${isDownUnsafe}, nextMoveDown= x: ${nextMoveDown.x} y: ${nextMoveDown.y}`);
  console.log(`isLeftSafe ${isLeftUnsafe}, nextMoveLeft= ${nextMoveLeft.x} y: ${nextMoveLeft.y}`);
  console.log(`isRightSafe ${isRigihtUnsafe}, nextMoveRight= ${nextMoveRight.x} y: ${nextMoveRight.y}`);
  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}, HEAD X=${myHead.x}, Y=${myHead.y}, Width: ${boardWidth}, Height: ${boardHeight}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});