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
function drawOmNom3() {
    omNom = { x: 635, y: 670, size: 160 };

    if(frameCount % frameDelay === 0) {
        currentFrame++;
        if(currentFrame >= omNomFrames.length) {
            currentFrame = 0;
        }
    }
    image(supportImg, 635, 720, 160, 160);
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
    bubblePopped = false;
    bubbleActive = false;

    const topPin = {
        x: 520,
        y: 200,
        size: 40
    };
    const rightPin = {
        x: 640,
        y: 480,
        size: 40
    };
    const leftPin = {
        x: 362,
        y: 610,
        size: 40
    };

    pins.push(topPin);
    pins.push(rightPin);
    pins.push(leftPin);

    let ropeTop = new Rope(8, { x: topPin.x, y: topPin.y -15});
    ropes.push(ropeTop);

    let ropeRight = new Rope(6, { x: rightPin.x, y: rightPin.y});
    ropes.push(ropeRight);

    let ropeLeft = new Rope(5, { x: leftPin.x, y: leftPin.y});
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
    candyCons.push(conTop);
    candyCons.push(conRight);
    candyCons.push(conLeft);
    
    stars = [
        {
        x: 403,
        y: 335,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0

    },
    {
        x: 403,
        y: 405,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    },
    {
        x: 490,
        y: 650,
        collected: false,
        angle: 0,
        disappearing: false,
        disappearFrame: 0
        
    }
    ]
    
    drawOmNom2();
    gameState = "playing";
}

function loadLevel3() {

    // Reset da fase
    score = 0;
    pins = [];
    stars = [];
    ropes = [];
    candyCons = [];

    bubblePopped = false;
    bubbleActive = false;

    // =========================
    // PINO SUPERIOR
    // =========================

    const topPin = {
        x: width / 2,
        y: 170,
        size: 40
    };

    pins.push(topPin);

    // =========================
    // CORDA
    // =========================

    let ropeTop = new Rope(6, {
        x: topPin.x,
        y: topPin.y
    });

    ropes.push(ropeTop);

    // =========================
    // CHÃO
    // =========================

    ground = new Ground(
        width / 2,
        height + 500,
        width,
        20
    );

    // =========================
    // DOCE
    // =========================

    candy = Bodies.circle(
        width / 2,
        250,
        25,
        {
            density: 0.0002,
            restitution: 1,
            friction: 0.2,
            frictionAir: 0.01
        }
    );

    World.add(world, candy);

    // Conecta a corda ao doce
    let conTop = new Link(
        ropeTop,
        candy
    );

    candyCons.push(conTop);

    sopradores = [];

// Soprador da esquerda
sopradores.push({
    x: 335,
    y: 345,
    size: 70,
    directionX: 0.5,
    directionY: 0,
    active: false,
    frame: 0,
    frameCounter: 0
});

// Soprador da direita
sopradores.push({
    x: 655,
    y: 345,
    size: 70,
    directionX: -0.5,
    directionY: 0,
    active: false,
    frame: 0,
    frameCounter: 0
});

// Soprador inferior
sopradores.push({
    x: width / 2,
    y: 505,
    size: 70,
    directionX: 0,
    directionY: -0.5,
    active: false,
    frame: 0,
    frameCounter: 0
});

    // =========================
    // ESTRELAS
    // =========================

    stars = [

        // Estrela superior esquerda
        {
            x: 315,
            y: 155,
            collected: false,
            angle: 0,
            disappearing: false,
            disappearFrame: 0
        },

        // Estrela superior direita
        {
            x: 675,
            y: 155,
            collected: false,
            angle: 0,
            disappearing: false,
            disappearFrame: 0
        },

        // Estrela no meio da corda
        {
            x: width / 2,
            y: 305,
            collected: false,
            angle: 0,
            disappearing: false,
            disappearFrame: 0
        }
    ];

    // =========================
    // OM NOM
    // =========================

    drawOmNom3();

    // Começa a fase
    gameState = "playing";
}

function drawSopradores() {

    if (currentLevel !== 3) return;

    imageMode(CENTER);

    for (let i = 0; i < sopradores.length; i++) {

        let soprador = sopradores[i];

        push();

        // Posiciona o soprador
        translate(soprador.x, soprador.y);

        // ============================
        // ROTAÇÃO
        // ============================

        // Soprador esquerdo
        if (i === 0) {
            rotate(PI / 2); // 45° horário
        }

        // Soprador direito
        if (i === 1) {
            rotate(-PI / 2); // 45° anti-horário
        }

        // Soprador inferior
        if (i === 2) {
            rotate(0); // sem rotação
        }

        // ============================
        // ANIMAÇÃO
        // ============================

        if (soprador.active) {

            soprador.frameCounter++;

            if (soprador.frameCounter >= 3) {

                soprador.frameCounter = 0;
                soprador.frame++;

                if (soprador.frame >= sopradorFrames.length) {

                    soprador.frame = 0;
                    soprador.active = false;
                }
            }

            image(
                sopradorFrames[soprador.frame],
                0,
                0,
                soprador.size,
                soprador.size
            );

        } else {

            image(
                sopradorImg,
                0,
                0,
                soprador.size,
                soprador.size
            );
        }

        pop();
    }
}

function ativarSoprador(soprador) {

    if(!candy) return;

    soprador.active = true;
    soprador.frame = 0;
    soprador.frameCounter = 0;

    Matter.Body.applyForce(
        candy,
        candy.position,
        {
            x: soprador.directionX * 0.015,
            y: soprador.directionY * 0.015
        }
    );
}

function atualizarSopradores() {

    if(currentLevel !== 3) return;
    if(!candy) return;

    for(let soprador of sopradores) {

        if(soprador.active) {

            Matter.Body.applyForce(
                candy,
                candy.position,
                {
                    x: soprador.directionX * 0.0015,
                    y: soprador.directionY * 0.0015
                }
            );
        }
    }
}