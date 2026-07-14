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
let restartImg;
let pauseImg;
let playImg;
let gameMusic;
let breakSound;
let ropeSound;
let star1Sound;
let star2Sound;
let star3Sound;
let winSound;

let musicEnable = true;
let musicStarted = false;
let paused = false;



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
const restartButton = {x: 0, y: 45, size: 50};
const pauseButton = {x: 0, y:45, size: 50};

let cuts = [];


function preload() {
    backgroundImg = loadImage("img/bg-box.jpeg");
    supportImg = loadImage("img/support1.png");
    candyImg = loadImage("img/candy.png");
    starImg = loadImage("img/star-cut-the-rope.png");
    bgSoundImg = loadImage("img/bg-sound.png");
    speakerImg = loadImage("img/speaker.png");
    pauseImg = loadImage("img/pause.png");
    restartImg = loadImage("img/restart.png");
    playImg = loadImage("img/play.png");

    //sons
    gameMusic = loadSound("sounds/game-music.mp3");
    breakSound = loadSound("sounds/candy_break.wav");
    ropeSound = loadSound("sounds/rope_get.wav");
    star1Sound = loadSound("sounds/star_1.wav");
    star2Sound = loadSound("sounds/star_2.wav");
    star3Sound = loadSound("sounds/star_3.wav");
    winSound = loadSound("sounds/win.wav");

    //om nom
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
    restartButton.x = width -110;
    pauseButton.x = width -45;
}

function draw() {
    background(255, 0, 0);

    imageMode(CORNER);

    image(backgroundImg, 0, 0, width, height);
    if(gameState === "menu") {
        drawMenu();
        return;
    }
    
    if(!paused) {
        Engine.update(engine, deltaTime);
    }
    
    drawStars();
    drawPins();

    if(ground) {
        ground.display();
    }

    if(rope) {
        rope.display();
        drawCuts();
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

    if(paused) {
        fill(0, 180);
        rect(0, 0, width, height);
        textAlign(CENTER);
        fill(255);
        textSize(60);
        text("paused", width /2, height /2);
        textSize(22);
        text("click at play button to continue", width /2, height /2 + 50);
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
        playEffect(winSound);
        gameState = "win";

        World.remove(world, candy);
        candy = null;
    }
}

function checkLose() {
    if(!candy) return;

    if(candy.position.y > height +50 || candy.position.x < -100 || candy.position.x > width +100) { 
        playEffect(breakSound);
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
    if(paused) return;
    if(gameState !== "playing") return;
    
    if(!rope) return;

    for(let body of rope.body.bodies) {
        let d = dist(mouseX, mouseY, body.position.x, body.position.y);

        if(d < 20) {
            playEffect(ropeSound);
            cuts.push({
                x1: pmouseX,
                y1: pmouseY,
                x2: mouseX,
                y2: mouseY,
                life: 12
            });

            rope.break();

            if(candyCon) {
                candyCon.detach();
                candyCon = null;
            }
            World.remove(world, rope);

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
        rope = null;
    }

    if(ground && ground.body) {
        World.remove(world, ground.body);
        ground = null;
    }

    stars = [];
    score = 0;
    gameState = "playing";
    loadLevel1();
    
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
            switch(score) {
                case 1: 
                    playEffect(star1Sound);
                    break;
                case 2:
                    playEffect(star2Sound);
                    break;
                case 3:
                    playEffect(star3Sound);
                    break;
            }
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

    if(dist(mouseX, mouseY, restartButton.x, restartButton.y) < 25) {
        tint(255);
    }
    else{
        tint(255,170);   
    }

    
    image(restartImg, restartButton.x, restartButton.y, restartButton.size, restartButton.size);
    noTint();
    
    if(dist(mouseX, mouseY, pauseButton.x, pauseButton.y) < 25) {
        tint(255);
    }
    else{
        tint(255,170);   
    }

    if(paused) {
        image(playImg, pauseButton.x, pauseButton.y, pauseButton.size, pauseButton.size);
    }
    else {
        image(pauseImg, pauseButton.x, pauseButton.y, pauseButton.size, pauseButton.size);
    }
    
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

    if(dist(mouseX, mouseY, restartButton.x, restartButton.y) < restartButton.size /2) {
        restartLevel();
        return;
    }

    if(dist(mouseX, mouseY, pauseButton.x, pauseButton.y) < pauseButton.size /2) {
        paused = !paused;
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

function playEffect(sound) {
    if(!effectEnable) return;
    if(sound.isPlaying()) {
        sound.stop();
    }
    sound.play();
}

function drawCuts() {
    noFill();
   // strokeWeight(4);
    for(let i = cuts.length -1; i >= 0; i--) {
        let c = cuts[i];
        let alpha = map(c.life, 0, 12, 0, 255);
       // stroke(255, map(c.life, 0, 12, 0, 255));
        // line(c.x1, c.y1, c.x2, c.y2);
        let mx = (c.x1 + c.x2) /2;
        let my = (c.y1 + c.y2) /2;
        let dx = c.x2 - c.x1;
        let dy = c.y2 - c.y1;
        let px = -dy;
        let py = dx;
        let len = sqrt(px * px + py * py);
        if(len !=0) {
            px /= len;
            py /= len;
        }
        let curva = 20;
        mx += px * curva;
        my += py * curva;
        for(let j = 0; j < 8; j++) {
            let t = j /7;
            let offset = map(t, 0, 1, -6, 6);
            let w = 8 - abs(offset);

            stroke(180, 230, 255, alpha * 0.45);
            strokeWeight(w + 2);
            beginShape();
            curveVertex(c.x1 + px * offset * 0.2, c.y + py * offset * 0.2);
            curveVertex(c.x1 + px * offset * 0.2, c.y + py * offset * 0.2);
            curveVertex(mx + px * offset, my + py * offset);
            curveVertex(c.x2 + px * offset * 0.2, c.y2 + py * offset * 0.2);
            curveVertex(c.x2 + px * offset * 0.2, c.y2 + py * offset * 0.2);
            endShape();
            stroke(255, alpha);
            strokeWeight(3);
            beginShape();
            curveVertex(c.x1, c.y1);
            curveVertex(c.x1, c.y1);
            curveVertex(mx, my);
            curveVertex(c.x2, c.y2);
            curveVertex(c.x2, c.y2);
            endShape();
        }   

        /* stroke(180, 230, 255, alpha);
        strokeWeight(10);
        beginShape();
        curveVertex(c.x1, c.y1);
        curveVertex(c.x1, c.y1);
        curveVertex(mx, my);
        curveVertex(c.x2, c.y2);
        curveVertex(c.x2, c.y2);
        endShape();

        stroke(255, 255, 255, alpha);
        strokeWeight(4);
        beginShape();
        curveVertex(c.x1, c.y1);
        curveVertex(c.x1, c.y1);
        curveVertex(mx, my);
        curveVertex(c.x2, c.y2);
        curveVertex(c.x2, c.y2);
        endShape(); */

        c.life--;

        if(c.life <= 0) {
            cuts.splice(i, 1);
        }
    }
    noStroke();
}