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

// TRASH TALK
const TRASH = ["Never gonna give you up","Never gonna let you down", "Never gonna run around and desert you", 
"Never gonna make you cry", "Never gonna say goodbye",  "Never gonna tell a lie and hurt you"];

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
  console.log(JSON.stringify(gameState));
}


let moveSpaceCounter = {
  up: 0,
  down: 0,
  left: 0,
  right: 0
};
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
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  const trash_sentance = Math.floor(gameState.turn /10)%6;
  console.log(TRASH[trash_sentance]);

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  if (gameState.game.ruleset.name == 'wrapped') {
    console.log("Don't remove borders, this is a wrapped game");
  } else {
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
  //FLOODFILL ? LETS TRY
  floodBoard(boardHeight, boardWidth, snakebodies, myHead);
  let myLength = gameState.you.length;

  if(myLength > moveSpaceCounter.right) {
    isMoveSafe.right = false;
    console.log(`remove right - i am too fat`);
  } 
  if(myLength > moveSpaceCounter.left) {
    isMoveSafe.left = false;
    console.log(`remove left - i am too fat`);
  }
  if(myLength > moveSpaceCounter.up) {
    isMoveSafe.up = false;
    console.log(`remove up - i am too fat`);
  } 
  if(myLength > moveSpaceCounter.down) {
    isMoveSafe.down = false;
    console.log(`remove down - i am too fat`);
  }

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  console.log(safeMoves);

  const sortedBySurvival = Object.fromEntries(Object.entries(moveSpaceCounter).sort(([,a],[,b]) => a-b));
  var safestMove = Object.keys(sortedBySurvival)[Object.keys(sortedBySurvival).length-1];

  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Pick slowest death :)`);
    console.log(`MOVE ${gameState.turn}: ${safestMove}`);
    console.log(`----------------`);
    return { move: safestMove, shout: TRASH[trash_sentance] };
  }

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
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
      console.log(`MOVE ${gameState.turn}: nearestFood right`);
      console.log(`----------------`);
      return { move: "right" , shout: TRASH[trash_sentance] };
    }
    if (  myHead.x > nearestFood.x && isMoveSafe.left) {
      console.log(`MOVE ${gameState.turn}: nearestFood left`);
      console.log(`----------------`);
      return { move: "left" , shout: TRASH[trash_sentance] };
    }
    if (nearestFood.y > myHead.y && isMoveSafe.up) {
      console.log(`MOVE ${gameState.turn}: nearestFood up`);
      console.log(`----------------`);
      return { move: "up" , shout: TRASH[trash_sentance] };
    }
    if (  myHead.y > nearestFood.y && isMoveSafe.down) {
      console.log(`MOVE ${gameState.turn}: nearestFood down`);
      console.log(`----------------`);
      return { move: "down" , shout: TRASH[trash_sentance] };
    }
  }

  // Choose a random move from the safe moves
  console.log(`MOVE ${gameState.turn}: ${safestMove} - Fallback`);
  console.log(`----------------`);
  return { move: safestMove , shout: TRASH[trash_sentance] };
}



function floodBoard(boardHeight, boardWidth, snakebodies, myHead) {

  var rightMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var leftMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var upMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var downMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  
  moveSpaceCounter.right = fillMatrix(rightMatrix, myHead.y, myHead.x + 1, 0);
  moveSpaceCounter.left = fillMatrix(leftMatrix, myHead.y, myHead.x - 1, 0);
  moveSpaceCounter.up = fillMatrix(upMatrix, myHead.y + 1, myHead.x, 0);
  moveSpaceCounter.down = fillMatrix(downMatrix, myHead.y - 1, myHead.x, 0);
  console.log(moveSpaceCounter);

}

var fillStack = [];
// Flood fill algorithm implemented recursively
function fillMatrix(matrix, y, x, counter)
{
  if (!validCoordinates(matrix, y, x))
      return counter;
      
  if (matrix[y][x] == 1)
      return counter;
  
  matrix[y][x] = 1;
  counter++;

  counter = fillMatrix(matrix, y + 1, x, counter);
  counter = fillMatrix(matrix, y - 1, x, counter);
  counter = fillMatrix(matrix, y, x + 1 , counter);
  counter = fillMatrix(matrix, y, x -1 , counter);
  return counter;
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