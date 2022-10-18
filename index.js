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
  console.log(JSON.stringify(gameState, null, 2));
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

  if (myHead.y == 0) {       
    isMoveSafe.down = false;
    console.log(`remove down - border`);
  } else if (myHead.y == boardHeight-1) { 
    isMoveSafe.up = false;
    console.log(`remove up - border`);
  } 

  if (myHead.x == boardWidth-1) { 
    isMoveSafe.right = false;
    console.log(`remove right - border`);
  } else if (myHead.x == 0) { 
    isMoveSafe.left = false;
    console.log(`remove left - border`);
  }
 

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  var allBodies =[]; 
  var opponents = (gameState.board.snakes);

  opponents.forEach(element => {
    allBodies.push(element.body);
  });
  allBodies.push((gameState.board.hazards))
  var snakebodies =allBodies.flat(1);

  let nextMoveUp = {
    x: myHead.x,
    y: myHead.y+1
  };
  let nextMoveDown= {
    x: myHead.x,
    y: myHead.y-1
  };
  let nextMoveLeft= {
    x: myHead.x-1,
    y: myHead.y
  };
  let nextMoveRight= {
    x: myHead.x+1,
    y: myHead.y
  };


  let isUpUnsafe = snakebodies.filter(element => {
    if(element.x === nextMoveUp.x && element.y === nextMoveUp.y){
      return true;
    }
    return false;
  });
  
  let isDownUnsafe = snakebodies.filter(element => {
    if(element.x === nextMoveDown.x && element.y === nextMoveDown.y){
      return true;
    }
    return false;
  });

    
  let isLeftUnsafe = snakebodies.filter(element => {
    if(element.x === nextMoveLeft.x && element.y === nextMoveLeft.y){
      return true;
    }
    return false;
  });

  let isRigihtUnsafe = snakebodies.filter(element => {
    if(element.x === nextMoveRight.x && element.y === nextMoveRight.y){
      return true;
    }
    return false;
  });
  
  
  

  if(isUpUnsafe.length == 1){
    isMoveSafe.up = false;
    console.log(`remove up - suicide`);
  }

  if(isDownUnsafe.length == 1){
    isMoveSafe.down = false;
    console.log(`remove down - suicide`);
  }

  if(isLeftUnsafe.length == 1){
    isMoveSafe.left = false;
    console.log(`remove left - suicide`);
  }

  if(isRigihtUnsafe.length == 1){
    isMoveSafe.right = false;
    console.log(`remove right - suicide`);
  }





  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  console.log(safeMoves);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Carry on :)`);
    if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
      console.log(`carry on - left`);
      return { move: "left" };
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
      console.log(`carry on - right`);
      return { move: "right" };
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
      console.log(`carry on - up`);
      return { move: "up" };
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
      console.log(`carry on - down`);
      return { move: "down" };
    }
    return { move: "down" };
  }

  

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;
  var food = gameState.board.food;
  if(food.length> 0 ){
    var nearestFood;
    var distanceToNearestFood=99;
    food.forEach(thisFood => {
      var foodDistance = Math.abs(myHead.x - thisFood.x) + Math.abs(myHead.y - thisFood.y);
      
      if( distanceToNearestFood > foodDistance){
        nearestFood = thisFood;
        distanceToNearestFood=foodDistance;
        console.log("new food");
        console.log(nearestFood);
        console.log(distanceToNearestFood);
      }
    });

    if (nearestFood.x > myHead.x && isMoveSafe.right) {
      console.log("nearestFood right");
      return { move: "right" };
    }
    if (  myHead.x > nearestFood.x && isMoveSafe.left) {
      console.log("nearestFood left");
      return { move: "left" };
    }
    if (nearestFood.y > myHead.y && isMoveSafe.up) {
      console.log("nearestFood up");
      return { move: "up" };
    }
    if (  myHead.y > nearestFood.y && isMoveSafe.down) {
      console.log("nearestFood down");
      return { move: "down" };
    }
  }
  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  console.log(`MOVE ${gameState.turn}: ${nextMove}, HEAD X=${myHead.x}, Y=${myHead.y}, Width: ${boardWidth}, Height: ${boardHeight}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});