const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composite = Matter.Composite;

let engine;
let world;
let canvas;
let gameContainer;
let backgroundImg;
let candyImg;
let characterImg;


function preload() {
    backgroundImg = loadImage("img/background.jpg", () => console.log("background carregado!"), () => console.log("erro ao carregar background"));
    candyImg = loadImage("img/candy.png");
    characterImg = loadImage("img/character.png");

}

function setup() {
    canvas = createCanvas(960, 540);
    canvas.parent("game-container");
    gameContainer = document.getElementById("game-container");

    console.log(backgroundImg);
}

function draW() {
    background(255, 0, 0);

    imageMode(CORNER);

    image(backgroundImg, 0, 0, width, height);
    Engine.update(engine);
    
}