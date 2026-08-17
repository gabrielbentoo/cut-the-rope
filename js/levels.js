let pins = [];



function drawOmNom() {
    omNom = { x: 505, y: 670, size: 160};
    if(frameCount % frameDelay === 0) {
        currentFrame++;
        if(currentFrame >= omNomFrames.length) {
            currentFrame = 0;
        }
    }
    image(supportImg, 505, 720, 160, 160);
    image(omNomFrames[currentFrame], omNom.x, omNom.y, omNom.size, omNom.size);
}
function drawOmNom2() {
    omNom = { x: 515, y: 60, size: 160 };

    if(frameCount % frameDelay === 0) {
        currentFrame++;
        if(currentFrame >= omNomFrames.length) {
            currentFrame = 0;
        }
    }
    image(supportImg, 515, 100, 160, 160);
    image(omNomFrames[currentFrame], omNom.x, omNom.y, omNom.size, omNom.size);
}

function loadLevel1() {
   /* engine = Engine.create();
    world = engine.world;

    stars = []; */
    score = 0;
    pins = [];
    rope = new Rope(5, {x: width /2, y: 60});
    pins.push({
        x: width /2,
        y: 70,
        size: 40
    });

    ground = new Ground(width /2, height + 500, width, 20);

    candy = Bodies.circle(width /2, 320, 25, {
        density: 0.0002,
        restitution: 1,
        friction: 0.2,
        frictionAir: 0.01
    });
    World.add(world, candy);
    candyCon = new Link(rope, candy);
    stars = [];
    stars.push({
        x: 510,
        y: 350,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0

    });
    stars.push({
        x: 510,
        y: 450,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    });
    stars.push({
        x: 510,
        y: 550,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    });
    drawOmNom();

    gameState = "playing";
}

function loadLevel2() { 
    score = 0;
    pins = [];
    stars = [];
    ropes = [];
    candyCons = [];

    const topPin = {
        x: 520,
        y: 180,
        size: 40
    };
    const rightPin = {
        x: 610,
        y: 430,
        size: 40
    };
    const leftPin = {
        x: 382,
        y: 520,
        size: 40
    };

    pins.push(topPin);
    pins.push(rightPin);
    pins.push(leftPin);

    let ropeTop = new Rope(5, { x: topPin.x, y: topPin.y});
    ropes.push(ropeTop);

    let ropeRight = new Rope(3, { x: rightPin.x, y: rightPin.y});
    ropes.push(ropeRight);

    let ropeLeft = new Rope(3, { x: leftPin.x, y: leftPin.y});
    ropes.push(ropeLeft);
    
    ground = new Ground(width /2, height + 500, width, 20);

    candy = Bodies.circle(width /2, 280, 25, {
        density: 0.0002,
        restitution: 1,
        friction: 0.2,
        frictionAir: 0.01
    });
    World.add(world, candy);
    let conTop = new Link(ropeTop, candy);
    let conRight = new Link(ropeRight, candy);
    let conLeft = new Link(ropeLeft, candy);
    
    stars = [
        {
        x: 383,
        y: 250,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0

    },
    {
        x: 383,
        y: 320,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    },
    {
        x: 490,
        y: 565,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    }
    ]
    
    drawOmNom2();
    gameState = "playing";
}