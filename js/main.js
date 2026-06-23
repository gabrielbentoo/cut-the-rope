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
let starImg;

// OM NOM
let omNomFrames = [];
let currentFrame = 0;
let frameDelay = 15;
let omNom = { x: 505, y: 670, size: 160};

let rope;
let pinImg;
let gameState = "playing";

let stars = [];
let score = 0;

function preload() {
    backgroundImg = loadImage("img/bg-box.jpeg");
    supportImg = loadImage("img/support1.png");
    candyImg = loadImage("img/candy.png");
    starImg = loadImage("img/star-cut-the-rope.png");

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
    drawStars();
    Engine.update(engine);

    drawPins();

    if(ground) {
        ground.display();
    }

    if(rope) {
        rope.display();
    }
    
    imageMode(CENTER);
    image(supportImg, 505, 720, 160, 160);
    drawOmNom();

    if(candy) {
        image(candyImg, candy.position.x, candy.position.y, 60, 60);
    }
    
    drawScore();
    drawGameState();
    checkStars();
    checkWin();
    checkLose();

    if(candyCon && candyCon.link && candyCon.link.bodyA && candy) {
        stroke(255);
        line(candyCon.link.bodyA.position.x, candyCon.link.bodyA.position.y, candy.position.x, candy.position.y);
    }
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

function checkWin() {
    if(!candy) return;
    let d = dist(candy.position.x, candy.position.y, omNom.x, omNom.y);

    if(d < 80) {
        gameState = "win";

        World.remove(world, candy);
        candy = null;
    }
}

function checkLose() {
    if(!candy) return;

    if(candy.position.y > height +50) { 
        gameState = "lose";

        World.remove(world, candy);
        candy = null;
    }
}

function drawGameState() {
    if(gameState === "playing") return;
    push();
    fill(0, 0, 0);
    rect(0, 0 , width, height)
    textAlign(CENTER);
    textSize(40);
    fill(255);
    
    if(gameState === "win") {
        text("You win!", width /2, 150);
        
    }

    if(gameState === "lose") {
        text("You lose!", width /2, 150);
    }

    textSize(20);
    text("Press R to restart", width /2, 250);
    pop();
}

function mouseDragged() {
    if(!rope) return;

    for(let body of rope.body.bodies) {
        let d = dist(mouseX, mouseY, body.position.x, body.position.y);

        if(d < 20) {
            rope.break();

            if(candyCon) {
                candyCon.detach();
                candyCon = null;
            }

            break;
        }
    }
}

function keyPressed() {
    if(key === "r" || key === "R") {
        restartLevel();
    }
}

function restartLevel() {
    if(candy) {
        World.remove(world, candy);
        candy = null;
    }

    if(candyCon) {
        candyCon.detach();
        candyCon = null;
    }

    if(rope && rope.body) {
        Composite.remove(world, rope.body);
    }

    if(ground && ground.body) {
        World.remove(world, ground.body);
    }

    loadLevel1();
    gameState = "playing";
}

function drawStars() {
    imageMode(CENTER);
    for(let star of stars) {
        if(star.collected) continue;
        push();
        fill(255, 215, 0);
        stroke(255);
        image(starImg, star.x, star.y, 40, 40);
        pop();
    }
}

function checkStars() {
    if(!candy) return;
    for(let star of stars) {
        if(star.collected) continue;
        let d = dist(candy.position.x, candy.position.y, star.x, star.y);

        if(d < 40) {
        star.collected = true;
        score++;
    }
    }
}

function drawScore() {
    fill(255);
    textSize(24);
    textAlign(LEFT);
    text("⭐ " + score, 20, 40);
}

