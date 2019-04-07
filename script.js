"use strict";

document.addEventListener("DOMContentLoaded", function() {
    addNavigationHandlers();
    
    CANVAS.canvas = $("canvas");
    CANVAS.ctx = CANVAS.canvas.getContext("2d");
});

function $(id) {
    return document.getElementById(id);
}

/**
 * Adds the handlers for the page navigation
 */
function addNavigationHandlers() {
    $("menu").addEventListener("click", handleMenuSelection);
    $("retour_menu").addEventListener("click", changePage);
}

/**
 * Handles the start of the game with the menu selection
 * for game difficulty.
 * @param {Object} e MouseEvent 
 */
function handleMenuSelection(e) {
    if (e.target && e.target.nodeName.toUpperCase() === "INPUT") {
        let level;
        switch (e.target.value) {
            case "FACILE":
                level = 0;
                break;
            case "MEDIUM": 
                level = 1;
                break;
            case "DIFFICILE":
                level = 2; 
                break;
            default: 
                console.log("Error - Can't find difficulty");
                level = 0;
                break;
        }
        GAME.currentLevel = determineLevel(LEVELS.levels, level);
        $("jeu").classList.remove("invisible");
        $("menu").classList.add("invisible");
        startGame();
    }
}

/**
 * Handles the navigation betweent the start and end of the game.
 * @param {Object} e MouseEvent that contains the click event 
 */
function changePage(e) {
    if (e.target && e.target.id === "retour_menu") {
        $("jeu").classList.add("invisible");
        $("menu").classList.remove("invisible");
        let loseMsg = $("lose-msg");
        if (!loseMsg.classList.contains("invisible")) {
            loseMsg.classList.add("invisible");
        }
    }
}

/**
 * Handles the main game loop. Each iteration is
 * performed on the level's delay.
 * 
 */
function startGame() {
    // Set the dimensions of the canvas
    CANVAS.canvas.width = GAME.currentLevel.dimensions.width;
    CANVAS.canvas.height = GAME.currentLevel.dimensions.height;
    generateWalls(GAME.currentLevel.walls);
    generateFruit();
    placeSnake(GAME.currentLevel);
    addSnakeListeners();
    GAME.loopId = setInterval(() => {
        switchSnakeDirection();
    }, GAME.currentLevel.delay);
}

/**
 * All levels for the game are kept here.
 * Fruit are generated programmatically.
 * Walls are generated programmatically.
 */
const LEVELS = {
    levels: [
        {
            "level": 0,
            "dimensions": {width:500, height:500},
            "delay": 50,
            "walls": 0
        },
        {
            "level": 1,
            "dimensions": {width:500, height:500},
            "delay": 40,
            "walls": 10
        },
        {
            "level": 2,
            "dimensions": {width:500, height:500},
            "delay": 20,
            "walls": 25
        }
    ]
}

const DIRECTION = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
];

const SNAKE = {
    coords: [],
    initialLength: 4
}

const GAME = {
    // currentLevel: determineLevel(LEVELS.levels, 0),
    blockWidth: 10,
    blockHeight: 10
}

const CANVAS = {
    snakeColor: "black",
    fruitColor: "red",
    wallColor: "black",
    bgColor: "white"
}

/**
 * Determine la position initiale du serpent en fonction
 * du niveau choisi.
 * @param {Object} currentLevel Level object 
 */
function placeSnake(currentLevel) {
    CANVAS.ctx.fillStyle = CANVAS.snakeColor;
    let x = currentLevel.dimensions.width / 2;
    let y = currentLevel.dimensions.height / 2; 
    for (let i = 0; i < SNAKE.initialLength; i++) {
        let pos = {x: x + (i * GAME.blockWidth), y: y};
        SNAKE.coords.push(pos);
        CANVAS.ctx.fillRect(pos.x, pos.y, GAME.blockWidth, GAME.blockHeight);
    }
    SNAKE.head = 0;
}

/**
 * Ajoute les listeners pour les mouvements du serpent.
 * Utilise les touches du clavier.
 */
function addSnakeListeners() {
    document.addEventListener("keydown", (e) => {
        SNAKE.direction = e.key;
    });
}

/**
 * Dessine le serpent sur le canvas en utilisant les coordonnees
 * qui sont stockees dans l'objet SNAKE.
 */
function switchSnakeDirection() {
    switch (SNAKE.direction) {
        case "ArrowUp": 
            shiftSnake(0, -1);
            break;
        case "ArrowLeft": 
            shiftSnake(-1, 0);
            break;
        case "ArrowDown": 
            shiftSnake(0, 1);
            break;
        case "ArrowRight": 
            shiftSnake(1, 0);
            break;
    }
}

/**
 * Moves the snake's position by one block using the 
 * two params to indicate directions.
 * @param {int} stepX Step amount for the x axis
 * @param {int} stepY Step amount for the y axis
 */
function shiftSnake(stepX, stepY) {
    // Erase the last block of the snake's body from the canvas
    SNAKE.tail = SNAKE.coords[SNAKE.coords.length - 1];
    eraseBlock(SNAKE.tail);
    
    // Shift each position of the snake by one
    for (let i = SNAKE.coords.length - 1; i > 0; i--) {
        SNAKE.coords[i] = SNAKE.coords[i - 1];
    }

    // First position of the snake is assigned manually
    let second = SNAKE.coords[1];
    SNAKE.coords[0] = {
        x: second.x + (stepX * GAME.blockWidth), 
        y: second.y + (stepY * GAME.blockHeight) 
    };

    // Loop used for any operations applied to the snake's
    // current position
    let gameEnd = false;
    for (let i = 0; i < SNAKE.coords.length; i++) {
        if (i >= 1) {
            gameEnd = checkForHit(i);
            if (gameEnd === true) {
                break;
            }
        }
        eatFruit();
        gameEnd = wallHit();
        if (gameEnd === true) {
            break;
        }
        wallWrap(i);
    }

    // Check for the game's end
    if (gameEnd !== true) {
        // Draw the snake's head with its new coordinates
        drawBlock(SNAKE.coords[0], CANVAS.snakeColor);
    }
}

/**
 * Checks for a potential wrap on the borders of the game.
 * If the snake's body coordinate has reached a wall it will 
 * be wrapped to the opposing wall on that axis.
 * @param {int} index 
 */
function wallWrap(index) {
    let bodyCoord = SNAKE.coords[index];
    let boardWidth = GAME.currentLevel.dimensions.width;
    let boardHeight = GAME.currentLevel.dimensions.height;
    
    // Handling the X axis walls
    if (bodyCoord.x < 0) {
        SNAKE.coords[index].x = boardWidth;
    } else if (bodyCoord.x >= boardWidth) {
        SNAKE.coords[index].x = 0;
    }

    // Handling the Y axis walls
    if (bodyCoord.y < 0) {
        SNAKE.coords[index].y = boardHeight;
    } else if (bodyCoord.y >= boardHeight) {
        SNAKE.coords[index].y = 0;
    }
}

/**
 * Draws a single block on the canvas
 * @param {Object} position {x,y} position to draw
 */
function drawBlock(position, color) {
    CANVAS.ctx.fillStyle = color;
    CANVAS.ctx.fillRect(position.x, position.y, 
        GAME.blockWidth, GAME.blockHeight);
}

/**
 * Clears a rectangle off the canvas
 * @param {Object} position {x,y} of the block to erase 
 */
function eraseBlock(position) {
    CANVAS.ctx.clearRect(position.x, position.y, GAME.blockWidth, GAME.blockWidth);
}

/**
 * Checks if the head of the snake has the same coords as 
 * the coordinates of the snake's body. Ends the game
 * if the previous statement is true.
 * @param {int} index in the snake's body 
 */
function checkForHit(index) {
    let head = SNAKE.coords[0];
    let bodyCoord = SNAKE.coords[index];
    if (coordsCompare(head, bodyCoord)) {
        endGame();
        return true;
    }
}

/**
 * Handles the end of the game.
 */
function endGame() {
    let loseMsg = $("lose-msg");
    loseMsg.classList.remove("invisible");
    clearInterval(GAME.loopId);
    SNAKE.coords = [];
    SNAKE.direction = null;
}

/**
 * Compares two coordinates for a match.
 * @param {Object} coords1 First coordinates
 * @param {Object} coords2 Second coordinates 
 */
function coordsCompare(coords1, coords2) {
    return coords1.x === coords2.x && coords1.y === coords2.y;
}
        
/**
 * Fetches the configurations of the current level of the 
 * game.
 * @param {Array} levels Contains each level object
 * @param {int} current Current level to search for
 */
function determineLevel(levels, current) {
    return levels.find((l) => l.level === current);
}

/**
 * Checks if the snake's head is hitting a fruit on the canvas.
 * Removes the fruit from the board and generates a new one.
 */
function eatFruit() {
    let snakeHead = SNAKE.coords[0];
    let fruit = GAME.currentFruit;
    if (coordsCompare(snakeHead, fruit)) {
        // Grow snake
        SNAKE.coords.push(SNAKE.tail);
        drawBlock(SNAKE.tail, CANVAS.snakeColor);

        // Generate new fruit
        generateFruit();
    }
}

/**
 * Handles the creation of the fruit on the game board.
 * The creation is random and places a single fruit on
 * the board.
 */
function generateFruit() {
    let dims = GAME.currentLevel.dimensions;
    let conflict = false;
    let walls = GAME.currentLevel.wallCoords;
    let coords;
    do {
        // Loop until we get coordinates for the fruit that are 
        // not conflicting with those of the walls
        coords = getRandomNumber(dims);
        conflict = walls.some((wall) => { coordsCompare(wall, coords); });
    } while (conflict === true);
    
    // Draw the fruit on the canvas
    drawBlock(coords, CANVAS.fruitColor);

    // Store the position of the current fruit
    GAME.currentFruit = {x: coords.x, y: coords.y};
}

/**
 * Gets a random number that is within the canvas'
 * dimensions.
 * @param dims {x,y} Game dimensions
 * @return {x,y} object containing coordinates of the random
 * number.
 */
function getRandomNumber(dims) {
    let x = Math.random() * dims.width;
    let y = Math.random() * dims.height;

    // Remaineder is used to bring the number back to the
    // closest integer that is a multiple of the block size
    x = x - (x % GAME.blockWidth);
    y = y - (y % GAME.blockWidth);

    return {x: x, y: y};
}

/**
 * Checks if the snake's head is hitting any of the defined
 * walls in the current level. Ends the game if the snake 
 * hit his head against a wall.
 */
function wallHit() {
    let snakeHead = SNAKE.coords[0];
    let walls = GAME.currentLevel.wallCoords;
    if (walls && walls.length > 0) {
        walls.some((wall) => {
            if (coordsCompare(snakeHead, wall)) {
                // Snake head hit the wall
                endGame();
                return true;
            }
        });
    }
}

/**
 * Creates and draws the walls on the canvas.
 * @param {Array} walls Objects that defined {x,y} coordinates
 * for every wall
 */
function generateWalls(walls) {
    let dims = GAME.currentLevel.dimensions;
    GAME.currentLevel.wallCoords = [];
    for (let i = 0; i < walls; i++) {
        let wallCoord = getRandomNumber(dims);
        GAME.currentLevel.wallCoords.push(wallCoord);
        drawBlock(wallCoord, CANVAS.wallColor);
    }
}