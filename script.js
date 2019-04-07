"use strict";

document.addEventListener("DOMContentLoaded", function() {
    $("start").addEventListener("click", changePage);
    $("retour_menu").addEventListener("click", changePage);
    
    CANVAS.canvas = $("canvas");
    CANVAS.ctx = CANVAS.canvas.getContext("2d");
    
    CANVAS.canvas.width = GAME.currentLevel.dimensions.width;
    CANVAS.canvas.height = GAME.currentLevel.dimensions.height;
});

function $(id) {
    return document.getElementById(id);
}

/**
 * Handles the navigation betweent the start and end of the game.
 * @param {Object} e MouseEvent that contains the click event 
 */
function changePage(e) {
    if (e.target && e.target.id === "start") {
        $("jeu").classList.remove("invisible");
        $("menu").classList.add("invisible");
        startGame();
    } else if (e.target && e.target.id === "retour_menu") {
        $("jeu").classList.add("invisible");
        $("menu").classList.remove("invisible");
    }
}

/**
 * Handles the main game loop. Each iteration is
 * performed on the level's delay.
 * 
 */
function startGame() {
    placeSnake(GAME.currentLevel);
    addSnakeListeners();
    setInterval(() => {
        switchSnakeDirection();
    }, GAME.currentLevel.delay);
}

/**
 * All levels for the game are kept here
 */
const LEVELS = {
    levels: [
        {
            "level": 0,
            "dimensions": {width:500, height:500},
            "walls": [
                [5,5], [5,6], [5,7], [5,8], [70,35], [71,35], [72,35]
            ],
            "fruit": [
                [10,10]
            ],
            "delay": 50
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
    currentLevel: determineLevel(LEVELS.levels, 0),
    blockWidth: 12,
    blockHeight: 12
}

const CANVAS = {}

/**
 * Determine la position initiale du serpent en fonction
 * du niveau choisi.
 * @param {Object} currentLevel Level object 
 */
function placeSnake(currentLevel) {
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
        setSnakeDirection(e.key);
    });
}

function setSnakeDirection(direction) {
    SNAKE.direction = direction;
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
        default: 
            console.log("Waiting for user input");
            break;
    }
}

function shiftSnake(stepX, stepY) {
    eraseBlock(SNAKE.coords[SNAKE.coords.length - 1]);
    for (let i = SNAKE.coords.length - 1; i > 0; i--) {
        SNAKE.coords[i] = SNAKE.coords[i - 1];
    }
    // Deuxieme position du serpent
    let second = SNAKE.coords[1];
    SNAKE.coords[0] = {
        x: second.x + (stepX * GAME.blockWidth), 
        y: second.y + (stepY * GAME.blockHeight) 
    };
    for (let i = 0; i < SNAKE.coords.length; i++) {
        if (i >= 1) {
            checkForHit(i);
        }
        wallWrap(i);
    }
    draw();
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
 * Draws the new position of the snake object
 */
function draw() {
    CANVAS.ctx.fillStyle = "black";
    CANVAS.ctx.fillRect(SNAKE.coords[0].x, SNAKE.coords[0].y, 
        GAME.blockWidth, GAME.blockHeight);
}

/**
 * Erases a single block from the canvas
 * @param {Object} position {x,y} position to erase
 */
function eraseBlock(position) {
    CANVAS.ctx.fillStyle = "white";
    CANVAS.ctx.fillRect(position.x, position.y, 
        GAME.blockWidth, GAME.blockHeight);
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
    }
}

function endGame() {
    alert("You lose!");
}

/**
 * Compares two coordinates for a match.
 * @param {Object} coords1 First coordinates
 * @param {Object} coords2 Second coordinates 
 */
function coordsCompare(coords1, coords2) {
    return coords1.x === coords2.x && coords1.y === coords2.y;
}
        
function determineLevel(levels, current) {
    return levels.find((l) => l.level === current);
}