function loadLevel1() {
    engine = Engine.create();
    world = engine.world;
    rope = new Rope(5, {x: width /2, y: 60});
}