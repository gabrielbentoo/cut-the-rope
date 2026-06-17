const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

let engine;
let world;
let canvas;
let backgroundImg;
let candyImg;
let candy;
let candyCon;
let ground;
let supportImg;

// OM NOM
let omNomFrames = [];
let currentFrame = 0;
let frameDelay = 15;
let omNom = { x: 505, y: 670, size: 160};

let rope;
let pinImg;

function preload() {
    backgroundImg = loadImage("img/bg-box.jpeg");
    supportImg = loadImage("img/support1.png");
    candyImg = loadImage("img/candy.png");

    omNomFrames.push(loadImage("img/om-nom1.png"));
    omNomFrames.push(loadImage("img/om-nom2.png"));
    omNomFrames.push(loadImage("img/om-nom2.png"));
    omNomFrames.push(loadImage("img/om-nom1.png"));
    omNomFrames.push(loadImage("img/om-nom3.png"));
    omNomFrames.push(loadImage("img/om-nom4.png"));
    omNomFrames.push(loadImage("img/om-nom4.png"));
    omNomFrames.push(loadImage("img/om-nom5.png"));
    omNomFrames.push(loadImage("img/om-nom4.png"));
    omNomFrames.push(loadImage("img/om-nom5.png"));
    omNomFrames.push(loadImage("img/om-nom6.png"));

    pinImg = loadImage("img/pino-parede.png");
    

}

function setup() {
    canvas = createCanvas(1027, 768);
    engine = Engine.create();

    engine.positionIterations = 12;
    engine.velocityIterations = 10;
    engine.constraintIterations = 8;

    world = engine.world;

    loadLevel1();
}

function draw() {
    background(255, 0, 0);

    imageMode(CORNER);

    image(backgroundImg, 0, 0, width, height);
    Engine.update(engine);

    drawPins();
    rope.display();

    imageMode(CENTER);
    image(supportImg, 505, 720, 160, 160);
    drawOmNom();

    image(candyImg, candy.position.x, candy.position.y, 60, 60);
    // ground.display();
}

function drawOmNom() {
    if(frameCount % frameDelay === 0) {
        currentFrame++;
        if(currentFrame >= omNomFrames.length) {
            currentFrame = 0;
        }
    }
    image(omNomFrames[currentFrame], omNom.x, omNom.y, omNom.size, omNom.size);
}

function drawPins() {
    imageMode(CENTER);
    for(let pin of pins) {
        image(pinImg, pin.x, pin.y, pin.size, pin.size);
    }
}