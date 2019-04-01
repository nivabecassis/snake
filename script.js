"use strict";

function $(id) {
    return document.getElementById(id);
}

function init() {
    console.log("Loaded the page");
    $("start").addEventListener("click", changePage);
    CANVAS.canvas = $("canvas");
    CANVAS.ctx = CANVAS.canvas.getContext("2d");
    
    // Ajouter les dimensions du canvas
    let current = GAME.currentLevel;
    console.log(current);
    CANVAS.canvas.width = current["dimensions"].width;
    CANVAS.canvas.height = current["dimensions"].height;
}

function changePage(e) {
    if (e.target) {
        $("jeu").classList.remove("invisible");
        $("menu").classList.add("invisible");
        
        // Debut du jeu
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
        drawSnake();
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
            "delay": 500
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
    direction: "ArrowLeft",
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
        switchSnakeDirection(e.key);
    });
}

function switchSnakeDirection(direction) {
    console.log(direction);
    SNAKE.direction = direction;
}



/**
 * Dessine le serpent sur le canvas en utilisant les coordonnees
 * qui sont stockees dans l'objet SNAKE.
 */
function drawSnake() {
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
    // Draw new position
    CANVAS.ctx.fillStyle = "black";
    CANVAS.ctx.fillRect(SNAKE.coords[0].x, SNAKE.coords[0].y, GAME.blockWidth, GAME.blockHeight);

    // Remove old position
    CANVAS.ctx.fillStyle = "white";
    CANVAS.ctx.fillRect(SNAKE.coords[SNAKE.coords.length - 1].x, 
        SNAKE.coords[SNAKE.coords.length - 1].y, GAME.blockWidth, GAME.blockHeight);
}

function shiftSnake(stepX, stepY) {
    for (let i = SNAKE.coords.length - 1; i > 0; i--) {
        SNAKE.coords[i] = SNAKE.coords[i - 1];
    }
    // Deuxieme position du serpent
    let second = SNAKE.coords[1];
    SNAKE.coords[0] = {
        x: second.x + (stepX * GAME.blockWidth), 
        y: second.y + (stepY * GAME.blockHeight) 
    };
}
        
function determineLevel(levels, current) {
    return levels.find((l) => l["level"] === current);
}

document.addEventListener("DOMContentLoaded", init);