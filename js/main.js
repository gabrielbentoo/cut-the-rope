let canvas;
let gameContainer;

function setup() {
    canvas = createCanvas(500, 700);
    canvas.parent("game-container");
    gameContainer = document.getElementById("game-container");
}