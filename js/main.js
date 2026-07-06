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
let gameMusic;
let musicEnable = true;
let musicStarted = false;


// OM NOM
let omNomFrames = [];
let currentFrame = 0;
let frameDelay = 15;
let omNom = { x: 505, y: 670, size: 160};

let rope;
let pinImg;
let gameState = "menu";

let stars = [];
let score = 0;

let bgSoundImg;
let speakerImg;
let effectEnable = true;

const musicButton = {x: 45, y: 45, size: 50};
const effectButton = {x: 110, y: 45, size: 50};


function preload() {
    backgroundImg = loadImage("img/bg-box.jpeg");
    supportImg = loadImage("img/support1.png");
    candyImg = loadImage("img/candy.png");
    starImg = loadImage("img/star-cut-the-rope.png");
    bgSoundImg = loadImage("img/bg-sound.png");
    speakerImg = loadImage("img/speaker.png");

    gameMusic = loadSound("sounds/game-music.mp3");

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

    world = engine.world;

}

function draw() {
    background(255, 0, 0);

    imageMode(CORNER);

    image(backgroundImg, 0, 0, width, height);
    if(gameState === "menu") {
        drawMenu();
        return;
    }
    
    Engine.update(engine, deltaTime);
    drawStars();

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
    
   
    checkStars();
    checkWin();
    checkLose();
    drawScore();
    drawGameState();
    drawAudioButtons();

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
    if(gameState !== "playing") return;
    
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

    if(!musicStarted) {
        gameMusic.setVolume(0.3);
        gameMusic.loop();
        musicStarted = true;
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
        translate(star.x, star.y);
        let scaleX = abs(cos(star.angle));
        scale(scaleX, 1);
        image(starImg, 0, 0, 40, 40);
        pop();
        star.angle += 0.05;
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

function drawAudioButtons() {
    imageMode(CENTER);

    if(musicEnable) {

       if(dist(mouseX, mouseY, musicButton.x, musicButton.y) < 25) {
            tint(255, 255);
        }
        else{
            tint(255, 170);
        }
    }
    else{
        tint(120,120);
    }
   // tint(255, 180);

    image(bgSoundImg, musicButton.x, musicButton.y, musicButton.size, musicButton.size);
    noTint();
    if(effectEnable) {
        if(dist(mouseX, mouseY, effectButton.x, effectButton.y) < 25) {
            tint(255, 255);
        }
        else{
            tint(255, 170);
        }
    }
    else{
            tint(120, 120);
        }
    
    image(speakerImg, effectButton.x, effectButton.y, effectButton.size, effectButton.size);
    noTint();

    strokeWeight(3);
    stroke(220, 40, 40);

    const r = 15;

    if(!musicEnable) {
        line(musicButton.x - r, musicButton.y - r, musicButton.x + r, musicButton.y + r);
        line(musicButton.x + r, musicButton.y - r, musicButton.x - r, musicButton.y + r);
    }

    if(!effectEnable) {
        line(effectButton.x - r, effectButton.y - r, effectButton.x + r, effectButton.y + r);
        line(effectButton.x + r, effectButton.y - r, effectButton.x - r, effectButton.y + r);
    }
    noStroke();
}

function mousePressed() {
    if(gameState === "menu") {
        userStartAudio();
        gameMusic.setVolume(0.35);
        gameMusic.loop();
        gameState = "playing";

        loadLevel1();
        return;
    }
    if(dist(mouseX, mouseY, musicButton.x, musicButton.y) < musicButton.size / 2) {
        toggleMusic();
        return;
    }

    if(dist(mouseX, mouseY, effectButton.x, effectButton.y) < effectButton.size /2) {
        effectEnable = !effectEnable;
        return;
    }
}

function toggleMusic() {
    musicEnable =  !musicEnable;

    if(musicEnable) {
        if(!gameMusic.isPlaying()) {
            gameMusic.setVolume(0.3);
            gameMusic.loop();
        }   
    }
    else{
        gameMusic.stop();
    }
    
}

function drawMenu() {
    imageMode(CORNER);
    image(backgroundImg, 0, 0, width, height);
    fill(0, 150);
    rect(0, 0, width, height);
    textAlign(CENTER);
    fill(255);
    textSize(70);
    text("CUT THE ROPE", width /2, 180);

    textSize(28);
    text("Clique para jogar", width /2, 300);
}