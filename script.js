"use strict";

document.addEventListener("DOMContentLoaded", function() {
    console.log("Loaded the page");
    $("start").addEventListener("click", changePage);
    CANVAS.canvas = $("canvas");
    CANVAS.ctx = CANVAS.canvas.getContext("2d");
    
    // Ajouter les dimensions du canvas
    let current = GAME.currentLevel;
    console.log(current);
    CANVAS.canvas.width = current["dimensions"].width;
    CANVAS.canvas.height = current["dimensions"].height;
});

function $(id) {
    return document.getElementById(id);
}

function changePage(e) {
    if (e.target) {
        $("jeu").classList.remove("invisible");
        $("menu").classList.add("invisible");
        startGame();
    }
}

/**
 * Fonction garde la boucle principale du jeu.
 */
function startGame() {
    placeSnake(GAME.currentLevel);
    addSnakeListeners();
    setInterval(() => {
        switchSnakeDirection();
        // draw();
    }, GAME.currentLevel["delay"]);
}

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
    // direction: "ArrowLeft",
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
    let x = currentLevel["dimensions"].width / 2;
    let y = currentLevel["dimensions"].height / 2; 
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
    console.log(direction);
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
    draw();
    checkForHit(); 
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
 * any of the coordinates of the snake's body. Ends the game
 * if the previous statement is true.
 */
function checkForHit() {
    let head = SNAKE.coords[0];
    // Start at i = 1 to skip the head of the snake
    for (let i = 1; i < SNAKE.coords.length; i++) {
        let bodyCoord = SNAKE.coords[i];
        if (coordsCompare(head, bodyCoord)) {
            endGame();
        }
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
    return levels.find((l) => l["level"] === current);
}