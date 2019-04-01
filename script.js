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
    CANVAS.canvas.width = current["dimensions"][0];
    CANVAS.canvas.height = current["dimensions"][1];
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
        switchSnakeDirection(SNAKE.direction);
        drawSnake();
    }, GAME.currentLevel["delay"]);
}

const LEVELS = {
    levels: [
        {
            "level": 0,
            "dimensions": [500,500],
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
    let x = currentLevel["dimensions"][0] / 2;
    let y = currentLevel["dimensions"][1] / 2; 
    SNAKE.coords.push([x,y]);
    for (let i = 1; i < SNAKE.initialLength; i++) {
        SNAKE.coords.push([x + i, y]);
    }
    SNAKE.head = 0;
}

/**
 * Ajoute les listeners pour les mouvements du serpent.
 * Utilise les touches du clavier.
 */
function addSnakeListeners() {
    document.addEventListener("keydown", function(event) {
        switchSnakeDirection(event.key);
    });
}

function switchSnakeDirection(direction) {
    switch (direction) {
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
    SNAKE.direction = direction;
}


function shiftSnake(stepX, stepY) {
    for (let i = SNAKE.coords.length - 1; i > 0; i--) {
        SNAKE.coords[i] = SNAKE.coords[i - 1];
    }
    // Deuxieme position du serpent
    let second = SNAKE.coords[1];
    SNAKE.coords[0] = [
        second[0] + stepX * GAME.blockWidth, // X
        second[1] + stepY * GAME.blockHeight// Y
    ];
}

/**
 * Dessine le serpent sur le canvas en utilisant les coordonnees
 * qui sont stockees dans l'objet SNAKE.
 */
function drawSnake() {
    SNAKE.coords.forEach((coord) => {
        // coord: [x,y]
        console.log(SNAKE.coords, coord);
        CANVAS.ctx.fillRect(coord[0], coord[1], GAME.blockWidth, GAME.blockHeight);
    });
}

function determineLevel(levels, current) {
    return levels.find((l) => l["level"] === current);
}

document.addEventListener("DOMContentLoaded", init);