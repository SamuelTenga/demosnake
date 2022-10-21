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
  food = [];

  constructor(food) {
    this.food = food;
  }
  
  };

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
    console.log("Don't remove borders, this is a wrapped game");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
  console.log(JSON.stringify(gameState));
}




// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  const food = gameState.board.food;
  const wrapped=(gameState.game.ruleset.name == 'wrapped');
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  let stateMatrix = {
    up: new State(food),
    down:new State(food),
    left: new State(food),
    right: new State(food)
  };

  const myHead = gameState.you.head;
  var allBodies =[]; 
  var opponents = (gameState.board.snakes);

  opponents.forEach(element => {
    allBodies.push(element.body);
  });
  allBodies.push((gameState.board.hazards))
  var snakebodies =allBodies.flat(1);


  //FLOODFILL 
  var rightMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var leftMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var upMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);
  var downMatrix = generateMatrix(boardHeight, boardWidth, snakebodies);

  
  
  stateMatrix.right = fillMatrix(rightMatrix, myHead.y, myHead.x + 1, stateMatrix.right);
  stateMatrix.left = fillMatrix(leftMatrix, myHead.y, myHead.x - 1,stateMatrix.left);
  stateMatrix.up = fillMatrix(upMatrix, myHead.y + 1, myHead.x,stateMatrix.up);
  stateMatrix.down = fillMatrix(downMatrix, myHead.y - 1, myHead.x, stateMatrix.down);
  console.log("stateMatrix:");
  console.log(stateMatrix);
  let myLength = gameState.you.length;

  // // Are there any safe moves left?

  var sortedBySurvival = Object.fromEntries(Object.entries(stateMatrix).sort(([,a],[,b]) => (a.maxDepth > b.maxDepth) ? 1 : ((b.maxDepth > a.maxDepth) ? -1 : 0)));
  var safestMove = Object.keys(sortedBySurvival)[3];
  var snakeMaxLenght =  Object.values(sortedBySurvival)[3].maxDepth;
  console.log("sortedBySurviva:l");
  var a = new State();
  console.log(sortedBySurvival);
  var doubleSort = Object.fromEntries(Object.entries(stateMatrix).sort(
    ([,a],[,b]) => {
    if (a.maxDepth === b.maxDepth){
      return a.nearestFood < b.nearestFood ? -1 : 1
    } else {
      return a.maxDepth < b.maxDepth ? -1 : 1
    }
  }));

  console.log("doubleSort:");
  console.log(doubleSort);
  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  
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


// Flood fill algorithm implemented recursively
function fillMatrix(matrix, y, x, state)
{
  //should now work with wrapped games
  y = y % matrix.length;
  x = x % matrix[0].length;

  if (!validCoordinates(matrix, y, x))
      return state;
      
  if (matrix[y][x] == 1)
      return state;
  
  matrix[y][x] = 1;
  state.maxDepth++;
  if(state.nearestFood > state.maxDepth && state.food.find(element => element.x == x && element.y == y)){
    state.nearestFood = state.maxDepth;
  }

  state = fillMatrix(matrix, y + 1, x, state);
  state = fillMatrix(matrix, y - 1, x, state);
  state = fillMatrix(matrix, y, x + 1 , state);
  state = fillMatrix(matrix, y, x -1 , state);
  return state;
}


// Returns true if specified row and col coordinates are in the matrix  -- DELETE ? Since I moduloed everything
function validCoordinates(matrix, y, x)
{
  return (y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length);
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