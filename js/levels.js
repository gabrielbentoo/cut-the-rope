let pins = [];


function loadLevel1() {
    engine = Engine.create();
    world = engine.world;

    score = 0;
    stars = [];
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
        angle: 0

    });
    stars.push({
        x: 510,
        y: 450,
        collected: false,
        angle: 0
        
    });
    stars.push({
        x: 510,
        y: 550,
        collected: false,
        angle: 0
        
    });

    gameState = "playing";
}