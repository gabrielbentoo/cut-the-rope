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
let candyCons = [];
let ground;
let supportImg;

let starImg;
let starDisappearFrames = [];
let starDisappearFrameDelay = 5;

let restartImg;
let pauseImg;
let nextImg;
let homeImg;
let playImg;
let menuBgImg;
let lvl1Img;
let lvl2Img;
let lvl3Img;
let lvlBlockedImg;
let gameMusic;
let breakSound;
let ropeSound;
let star1Sound;
let star2Sound;
let star3Sound;
let winSound;
let levels = [
    {
        id: 1,
        unlocked: true,
        img: null,
        x: 250,
        y: 350,

    },
    {
        id: 2,
        unlocked: false,
        img: null,
        x: 510,
        y: 350,
    },
    {
        id: 3,
        unlocked: false,
        img: null,
        x: 770,
        y: 350,
    }
];

let musicEnable = true;
let musicStarted = false;
let paused = false;



// OM NOM
let omNomFrames = [];
let currentFrame = 0;
let frameDelay = 15;
let omNom = {};

let rope;
let ropes = [];
let pinImg;
let gameState = "menu";

let stars = [];
let score = 0;
let starFilledImg;
let starEmptyImg;

let bgSoundImg;
let speakerImg;
let effectEnable = true;

const musicButton = {x: 45, y: 45, size: 50};
const effectButton = {x: 110, y: 45, size: 50};
const restartButton = {x: 0, y: 45, size: 50};
const pauseButton = {x: 0, y:45, size: 50};
let restartEndButton;
let homeButton;
let nextButton;
let currentLevel = 1;

let cuts = [];


function preload() {
    backgroundImg = loadImage("img/bg-box.jpeg");
    supportImg = loadImage("img/support1.png");
    candyImg = loadImage("img/candy.png");
    starImg = loadImage("img/star-cut-the-rope.png");
    starDisappearFrames.push(loadImage("img/obj_star_disappear_1.png"));
    starDisappearFrames.push(loadImage("img/obj_star_disappear_2.png"));
    starDisappearFrames.push(loadImage("img/obj_star_disappear_3.png"));

    bgSoundImg = loadImage("img/bg-sound.png");
    speakerImg = loadImage("img/speaker.png");
    pauseImg = loadImage("img/pause.png");
    restartImg = loadImage("img/restart.png");
    playImg = loadImage("img/play.png");
    starFilledImg = loadImage("img/estrela-preenchida-cut-the-rope.png");
    starEmptyImg = loadImage("img/estrela-vazada-cut-the-rope.png");
    homeImg = loadImage("img/home.png");
    nextImg = loadImage("img/next.png");
    
    //menu
    menuBgImg = loadImage("img/bg-lvl.png");
    lvl1Img = loadImage("img/lvl-1.png");
    lvl2Img = loadImage("img/lvl-2.png");
    lvl3Img = loadImage("img/lvl-3.png");
    lvlBlockedImg = loadImage("img/lvl-blocked.png");

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
    levels[0].img = lvl1Img;
    levels[1].img = lvlBlockedImg;
    levels[2].img = lvlBlockedImg;
    restartEndButton = {x: width /2 -80, y: 430, size: 70};
    homeButton = {x: width /2, y: 430, size: 70};
    nextButton = {x: width /2 +80, y: 430, size: 70};
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
    
    if(ropeTop) {
        ropeTop.display();
        drawCuts();
    }
    if(ropeRight) {
        ropeRight.display();
        drawCuts();
    }
    if(ropeLeft) {
        ropeLeft.display();
        drawCuts();
    }

    imageMode(CENTER);
    
    if (gameState === "playing" && candy && ropes.length > 0) {
        drawOmNom2();
    } else {
        drawOmNom();
    }

    if(candy) {
        image(candyImg, candy.position.x, candy.position.y, 60, 60);
    }
    
   
    checkStars();
    checkWin();
    checkLose();
    drawStarScore();
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

    //fundo
    imageMode(CORNER);
    image(backgroundImg, 0, 0, width, height);
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    //estrelas conquistadas
    imageMode(CENTER);
    const starSize = 60;
    const spacing = 70;
    let startX = width /2 -spacing;
    for(let i = 0; i < 3; i++) {
        let img = (i < score) ? starFilledImg : starEmptyImg;
        image(img, startX + i * spacing, 170, starSize, starSize);
    }

    //texto
   // push();
   // fill(0, 0, 0);
   // rect(0, 0 , width, height)
    textAlign(CENTER);
    textSize(40);
    fill(255);
    
    if(gameState === "win") {
        text("You win!", width /2, 290);
        
    }

    if(gameState === "lose") {
        text("You lose!", width /2, 290);
    }

    /* textSize(20);
    text("Press R to restart", width /2, 250);
     pop(); */
    drawEndButtons();
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
    loadCurrentLevel();
    
}

function drawStars() {
    imageMode(CENTER);
    for(let star of stars) {
        if(star.disappearing) {
            let frame = floor(star.disappearFrame / starDisappearFrameDelay);
            if(frame < starDisappearFrames.length) {
                image(starDisappearFrames[frame], star.x, star.y, 80, 80);
                star.disappearFrame++;
            }
            else{
                star.disappearing = false;
            }
            continue;
        }
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
        if(star.disappearing) continue;
        if(star.collected) continue;
        let d = dist(candy.position.x, candy.position.y, star.x, star.y);

        if(d < 40) {
            star.collected = true;
            star.disappearing = true;
            star.disappearFrame = 0;
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
    if(gameState == "win" || gameState == "lose"){
        if(dist(mouseX, mouseY, restartEndButton.x, restartEndButton.y) < restartEndButton.size /2) {
            restartLevel();
            return;
        } 
        if(dist(mouseX, mouseY, homeButton.x, homeButton.y) < homeButton.size /2) {
            clearLevel();
            currentLevel = 1;
           gameState = "menu";
            return;
        }
        if(gameState === "win" && dist(mouseX, mouseY, nextButton.x, nextButton.y) < nextButton.size /2) {
            nextLevel();
            return;
        } 

    }
    if(gameState === "menu") {
        for(let level of levels) {
            let d = dist(mouseX, mouseY, level.x, level.y);
            if(d < 90) {
                if(level.unlocked) {
                    if(level.id === 1) {
                        userStartAudio();
                        if(musicEnable) {
                            gameMusic.setVolume(0.35);
                            gameMusic.loop();
                        }
                        currentLevel = level.id;
                         loadCurrentLevel();
                         gameState = "playing";
                    }   
                }
                return;
            }
        }
         
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
    image(menuBgImg, 0, 0, width, height);
    imageMode(CENTER);
    for(let level of levels) {
        image(level.img, level.x, level.y, 180, 180);
    }
    
    /* fill(0, 150);
    rect(0, 0, width, height);
    textAlign(CENTER);
    fill(255);
    textSize(70);
    text("CUT THE ROPE", width /2, 180);

    textSize(28);
    text("Clique para jogar", width /2, 300);
    */
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

function drawStarScore() {
    imageMode(CENTER);
    const starSize = 40;
    const spacing = 50;
    const startX = width /2 - spacing;
    const y = 40;

    for(let i = 0; i < 3; i++) {
        if(i < score) {
            image(starFilledImg, startX + i * spacing, y, starSize, starSize);
        }
        else {
            image(starEmptyImg, startX + i * spacing, y, starSize, starSize);
        }
    }
}

function drawEndButtons() {
    imageMode(CENTER);
    drawButton(restartImg, restartEndButton);
    drawButton(homeImg, homeButton);
    if(gameState == "win") {
        drawButton(nextImg, nextButton);
    }
}

function drawButton(img, button) {
    let hover = dist(mouseX, mouseY, button.x, button.y) < button.size /2;
    push();
    translate(button.x, button.y);

    if(hover) {
        scale(1.12);
        tint(255);
    } 
    else{
        tint(255, 210);
    }
    image(img, 0, 0, button.size, button.size);
    pop();
    noTint();
}

function clearLevel() {
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
 }

 function loadCurrentLevel() {
    if(currentLevel === 1) {
        loadLevel1();
    }
    else if(currentLevel === 2){
        loadLevel2();
    }
 }

 function nextLevel() {
    if(currentLevel >= 2) {
        return;
    }
    clearLevel();
    currentLevel++;
    loadCurrentLevel();
    gameState = "playing";
 }