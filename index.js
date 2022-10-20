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
    author: "SamuelTenga",      
    color: "#86b300", 
    head: "beach-puffin",  
    tail: "beach-puffin", 
  };
}


class State {
  maxDepth = 0;
  nearestFood = 999;
  };

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
  if (gameState.game.ruleset.name == 'wrapped') {
    console.log("Don't remove borders, this is a wrapped game");
    wrapped = true;
  }
  boardHeight = gameState.board.height;
  boardWidth = gameState.board.width;
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
  console.log(JSON.stringify(gameState));
}

let wrapped=false;
let boardWidth = 0;
let boardHeight = 0;


// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let stateMatrix = {
    up: new State(),
    down:new State(),
    left: new State(),
    right: new State()
  };

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.head;


  // // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  // if (gameState.game.ruleset.name == 'wrapped') {
  //   console.log("Don't remove borders, this is a wrapped game");
  //   console.log(wrapped);
  // } else {
  //   if (myHead.y == 0) {       
  //     isMoveSafe.down = false;
  //     console.log(`remove down - border`);
  //   } else if (myHead.y == boardHeight-1) { 
  //     isMoveSafe.up = false;
  //     console.log(`remove up - border`);
  //   } 

  //   if (myHead.x == boardWidth-1) { 
  //     isMoveSafe.right = false;
  //     console.log(`remove right - border`);
  //   } else if (myHead.x == 0) { 
  //     isMoveSafe.left = false;
  //     console.log(`remove left - border`);
  //   }
  // }
 

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  var allBodies =[]; 
  var opponents = (gameState.board.snakes);

  opponents.forEach(element => {
    allBodies.push(element.body);
  });
  allBodies.push((gameState.board.hazards))
  var snakebodies =allBodies.flat(1);

  // let nextMoveUp = {
  //   x: myHead.x,
  //   y: myHead.y+1
  // };
  // let nextMoveDown= {
  //   x: myHead.x,
  //   y: myHead.y-1
  // };
  // let nextMoveLeft= {
  //   x: myHead.x-1,
  //   y: myHead.y
  // };
  // let nextMoveRight= {
  //   x: myHead.x+1,
  //   y: myHead.y
  // };


  // let isUpUnsafe = snakebodies.filter(element => {
  //   if(element.x === nextMoveUp.x && element.y === nextMoveUp.y){
  //     return true;
  //   }
  //   return false;
  // });
  // let isDownUnsafe = snakebodies.filter(element => {
  //   if(element.x === nextMoveDown.x && element.y === nextMoveDown.y){
  //     return true;
  //   }
  //   return false;
  // });
    
  // let isLeftUnsafe = snakebodies.filter(element => {
  //   if(element.x === nextMoveLeft.x && element.y === nextMoveLeft.y){
  //     return true;
  //   }
  //   return false;
  // });
  // let isRigihtUnsafe = snakebodies.filter(element => {
  //   if(element.x === nextMoveRight.x && element.y === nextMoveRight.y){
  //     return true;
  //   }
  //   return false;
  // });

  // if(isUpUnsafe.length == 1){
  //   isMoveSafe.up = false;
  //   console.log(`remove up - suicide`);
  // }

  // if(isDownUnsafe.length == 1){
  //   isMoveSafe.down = false;
  //   console.log(`remove down - suicide`);
  // }

  // if(isLeftUnsafe.length == 1){
  //   isMoveSafe.left = false;
  //   console.log(`remove left - suicide`);
  // }

  // if(isRigihtUnsafe.length == 1){
  //   isMoveSafe.right = false;
  //   console.log(`remove right - suicide`);
  // }
  //FLOODFILL ? LETS TRY
  var rightMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var leftMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var upMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var downMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  
  stateMatrix.right = fillMatrix(rightMatrix, myHead.y, myHead.x + 1, stateMatrix.right);
  stateMatrix.left = fillMatrix(leftMatrix, myHead.y, myHead.x - 1,stateMatrix.left);
  stateMatrix.up = fillMatrix(upMatrix, myHead.y + 1, myHead.x,stateMatrix.up);
  stateMatrix.down = fillMatrix(downMatrix, myHead.y - 1, myHead.x, stateMatrix.down);
  console.log(stateMatrix);
  let myLength = gameState.you.length;

  // if(myLength > stateMatrix.right.maxDepth) {
  //   isMoveSafe.right = false;
  //   console.log(`remove right - i am too fat`);
  // } 
  // if(myLength > stateMatrix.left.maxDepth) {
  //   isMoveSafe.left = false;
  //   console.log(`remove left - i am too fat`);
  // }
  // if(myLength > stateMatrix.up.maxDepth) {
  //   isMoveSafe.up = false;
  //   console.log(`remove up - i am too fat`);
  // } 
  // if(myLength > stateMatrix.down.maxDepth) {
  //   isMoveSafe.down = false;
  //   console.log(`remove down - i am too fat`);
  // }

  // // Are there any safe moves left?
  // const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  console.log("stateMatrix:");
  console.log(stateMatrix);
  var sortedBySurvival = Object.fromEntries(Object.entries(stateMatrix).sort(([,a],[,b]) => (a.maxDepth > b.maxDepth) ? 1 : ((b.maxDepth > a.maxDepth) ? -1 : 0)));
  var safestMove = Object.keys(sortedBySurvival)[Object.keys(sortedBySurvival).length-1];
  var snakeMaxLenght =  Object.entries(sortedBySurvival)[3].maxDepth;
  console.log("sortedBySurvival:");
  console.log(sortedBySurvival);
  console.log("snakeMaxLenght:");
  console.log(snakeMaxLenght);

  // if (safeMoves.length == 0) {
  //   console.log(`MOVE ${gameState.turn}: No safe moves detected! Pick slowest death :)`);
  //   console.log(`MOVE ${gameState.turn}: ${safestMove}`);
  //   console.log(`----------------`);
  //   return { move: safestMove};
  // }

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  var food = gameState.board.food;
  if(food.length> 0 ){
    var nearestFood;
    var distanceToNearestFood=99;
    food.forEach(thisFood => {
      var foodDistance;
      if(wrapped){
        foodDistance = Math.abs(myHead.x - thisFood.x) + Math.abs(myHead.y - thisFood.y);
      }
      
      if( distanceToNearestFood > foodDistance){
        nearestFood = thisFood;
        distanceToNearestFood=foodDistance;
        console.log("new food");
        console.log(nearestFood);
        console.log(distanceToNearestFood);
      }
    });

    if (nearestFood.x > myHead.x && sortedBySurvival.right.maxDepth == snakeMaxLenght) {
      console.log(`MOVE ${gameState.turn}: nearestFood right`);
      console.log(`----------------`);
      return { move: "right" };
    }
    if (  myHead.x > nearestFood.x && sortedBySurvival.left.maxDepth == snakeMaxLenght) {
      console.log(`MOVE ${gameState.turn}: nearestFood left`);
      console.log(`----------------`);
      return { move: "left" };
    }
    if (nearestFood.y > myHead.y && sortedBySurvival.up.maxDepth == snakeMaxLenght) {
      console.log(`MOVE ${gameState.turn}: nearestFood up`);
      console.log(`----------------`);
      return { move: "up" };
    }
    if (  myHead.y > nearestFood.y && sortedBySurvival.down.maxDepth == snakeMaxLenght) {
      console.log(`MOVE ${gameState.turn}: nearestFood down`);
      console.log(`----------------`);
      return { move: "down" };
    }
  }

  // Choose a random move from the safe moves
  console.log(`MOVE ${gameState.turn}: ${safestMove} - Fallback`);
  console.log(`----------------`);
  return { move: safestMove };
}





var fillStack = [];
// Flood fill algorithm implemented recursively
function fillMatrix(matrix, y, x, state)
{
  //should now work with wrapped games ? maybe
  y = y%boardHeight;
  x = x%boardWidth;

  if (!validCoordinates(matrix, y, x))
      return state;
      
  if (matrix[y][x] == 1)
      return state;
  
  matrix[y][x] = 1;
  state.maxDepth++;

  state = fillMatrix(matrix, y + 1, x, state);
  state = fillMatrix(matrix, y - 1, x, state);
  state = fillMatrix(matrix, y, x + 1 , state);
  state = fillMatrix(matrix, y, x -1 , state);
  return state;
}


// Returns true if specified row and col coordinates are in the matrix
function validCoordinates(matrix, row, col)
{
  return (row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length);
}

// Returns a matrix of specified number of rows and cols
function generateMatrix(yMax, xMax, snakes)
{
  var matrix = [];
  for(var row = 0; row < yMax; row++)
  {
      var arRow = new Array(xMax);
      
      for(var col = 0; col < xMax; col++)
      {
          arRow[col] = 0;
      }
      matrix.push(arRow);
  }
  // fill ones with ones
  snakes.forEach(hazzard => {
    matrix[hazzard.y][hazzard.x] = 1;
  });
  return matrix;
}


runServer({
  info: info,
  start: start,
  move: move,
  end: end
});