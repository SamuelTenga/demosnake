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
    color: "#000000", 
    head: "beluga",  
    tail: "skinny", 
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
  console.log(JSON.stringify(gameState));
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


  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  var boardWidth = gameState.board.width;
  var boardHeight = gameState.board.height;
  if (gameState.game.ruleset.name == 'wrapped') {
    console.log("Don't remove borders, this is a wrapped game")
  } else {
    console.log(JSON.stringify(gameState));
    console.log(JSON.stringify(gameState.game.ruleset.name));
    console.log(JSON.stringify(gameState.game.ruleset));
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





  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  console.log(safeMoves);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Carry on :)`);
    if (myNeck.x < myHead.x) {        // Neck is left of head, move right
      console.log(`carry on - right`);
      console.log(`----------------`);
      return { move: "right" };
    } else if (myNeck.x > myHead.x) { // Neck is right of head, move left
      console.log(`carry on - left`);
      console.log(`----------------`);
      return { move: "left" };
    } else if (myNeck.y < myHead.y) { // Neck is below head, move up
      console.log(`carry on - up`);
      console.log(`----------------`);
      return { move: "up" };
    } else if (myNeck.y > myHead.y) { // Neck is above head, move down
      console.log(`carry on - down`);
      console.log(`----------------`);
      return { move: "down" };
    }
    console.log(`----------------`);
    return { move: "down" };
  }

  //FLOODFILL ? LETS TRY
  var matrix = generateMatrix(boardHeight, boardWidth);
  console.log("init fllod");
  console.log(matrix);
  snakebodies.forEach(hazzard => {
    matrix[hazzard.y][hazzard.x] = 1;
  } );
  console.log("pre flood");
  console.log(matrix);

  var rightCopy = matrix;
  var leftCopy = matrix;
  var upCopy = matrix;
  var downCopy = matrix;
  var counter=0;
  var fillRight = fillMatrix1(rightCopy, myHead.y, myHead.x+1, counter);
  console.log(`FILL- ${counter}`);
  var fillLeft = fillMatrix1(leftCopy, myHead.y, myHead.x-1, counter);
  console.log(`FILL- ${counter}`);
  var fillUp = fillMatrix1(upCopy, myHead.y+1, myHead.x, counter);
  console.log(`FILL- ${counter}`);
  var fillDown = fillMatrix1(downCopy, myHead.y-1, myHead.x, counter);
  console.log(`FILL- ${counter}`);
  
  console.log(`FILL-RIGHT ${fillRight}`);
  console.log(`FILL-LEFT ${fillLeft}`);
  console.log(`FILL-UP ${fillUp}`);
  console.log(`FILL-DOWN ${fillDown}`);

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
      console.log(`----------------`);
      return { move: "right" };
    }
    if (  myHead.x > nearestFood.x && isMoveSafe.left) {
      console.log("nearestFood left");
      console.log(`----------------`);
      return { move: "left" };
    }
    if (nearestFood.y > myHead.y && isMoveSafe.up) {
      console.log("nearestFood up");
      console.log(`----------------`);
      return { move: "up" };
    }
    if (  myHead.y > nearestFood.y && isMoveSafe.down) {
      console.log("nearestFood down");
      console.log(`----------------`);
      return { move: "down" };
    }
  }
  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  console.log(`MOVE ${gameState.turn}: ${nextMove}, HEAD X=${myHead.x}, Y=${myHead.y}, Width: ${boardWidth}, Height: ${boardHeight}`)
  console.log(`----------------`);
  return { move: nextMove };
}

// Flood fill algorithm implemented recursively
function fillMatrix1(matrix, row, col, counter)
{
    if (!validCoordinates(matrix, row, col))
        return;
        
    if (matrix[row][col] == 1)
        return;
    
    matrix[row][col] = 1;
    counter++;

    fillMatrix1(matrix, row + 1, col, counter);
    fillMatrix1(matrix, row - 1, col. counter);
    fillMatrix1(matrix, row, col + 1 , counter);
    fillMatrix1(matrix, row, col -1 , counter);
    return counter;
}

// Flood fill algorithm implemented with a stack on the heap
// This algorithm will also work with big size matrixes
function fillMatrix2(matrix, row, col)
{
    fillStack.push([row, col]);
    
    while(fillStack.length > 0)
    {
        var [row, col] = fillStack.pop();
        
        if (!validCoordinates(matrix, row, col))
            continue;
            
        if (matrix[row][col] == 1)
            continue;
        
        matrix[row][col] = 1;
    
        fillStack.push([row + 1, col]);
        fillStack.push([row - 1, col]);
        fillStack.push([row, col + 1]);
        fillStack.push([row, col - 1]);
    }
}

// Returns true if specified row and col coordinates are in the matrix
function validCoordinates(matrix, row, col)
{
    return (row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length);
}

// Returns a matrix of specified number of rows and cols
function generateMatrix(rows, cols)
{
    var matrix = [];

    for(var row = 0; row < rows; row++)
    {
        var arRow = new Array(cols);
        
        for(var col = 0; col < cols; col++)
        {
            arRow[col] = 0;
        }
        
        matrix.push(arRow);
    }
    
    return matrix;
}


runServer({
  info: info,
  start: start,
  move: move,
  end: end
});