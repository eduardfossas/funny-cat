import { Rectangle } from "./rectangle.js";

const STICK_COLOR = "#faf0e6";
const IMAGES = ["cat-1.png", "cat-2.png", "cat-3.png", "cat-4.png"];

class App {
  constructor() {
    this.player = new Tone.Player("funny-meow.mp3").toDestination();
    this.canvas = {
      el: document.querySelector("canvas"),
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.matter = {
      composites: Matter.Composites,
      composite: Matter.Composite,
      engine: Matter.Engine,
      render: Matter.Render,
      runner: Matter.Runner,
      mouseConstraint: Matter.MouseConstraint,
      mouse: Matter.Mouse,
      bounds: Matter.Bounds,
      bodies: Matter.Bodies,
      world: Matter.World,
    };
    this.engine = this.matter.engine.create();
    this.world = this.engine.world;
    this.render = this.matter.render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: this.canvas.width,
        height: this.canvas.height,
        showStats: false,
        showPerformance: false,
        wireframes: false,
        background: STICK_COLOR,
      },
    });

    this.addResize();
    this.addBlock();
    this.renderWorld();
    this.createMouseEvent();
    this.addClick();

    this.runner = this.matter.runner.create();
    this.matter.runner.run(this.runner, this.engine);
  }

  async addBody() {
    await Tone.loaded();
    this.player.start();

    this.matter.world.add(
      this.engine.world,
      this.matter.bodies.circle(Math.random() * window.innerWidth, 30, 40, {
        render: {
          sprite: {
            texture: IMAGES[Math.round(Math.random() * (IMAGES.length - 1))],
          },
        },
      })
    );
  }

  addBlock() {
    this.matter.composite.add(this.world, [
      new Rectangle(this.canvas.width / 2, 0, this.canvas.width, 10, {
        isStatic: true,
        render: { opacity: 0 },
      }).rect,
      new Rectangle(
        this.canvas.width / 2,
        this.canvas.height,
        this.canvas.width,
        10,
        {
          isStatic: true,
          render: { opacity: 0 },
        }
      ).rect,
      new Rectangle(0, this.canvas.height / 2, 10, this.canvas.height, {
        isStatic: true,
        render: { opacity: 0 },
      }).rect,
      new Rectangle(
        this.canvas.width,
        this.canvas.height / 2,
        10,
        this.canvas.height,
        {
          isStatic: true,
          render: { opacity: 0 },
        }
      ).rect,
    ]);
  }

  createMouseEvent() {
    this.mouse = this.matter.mouse.create(this.render.canvas);
    this.mouseConstraint = this.matter.mouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    this.matter.composite.add(this.world, this.mouseConstraint);
  }

  setSize() {
    this.render.bounds.max.x = window.innerWidth;
    this.render.bounds.max.y = window.innerHeight;
    this.render.options.width = window.innerWidth;
    this.render.options.height = window.innerHeight;
    this.render.canvas.width = window.innerWidth;
    this.render.canvas.height = window.innerHeight;
  }

  addClick() {
    window.addEventListener("pointerup", () => this.addBody());
  }

  addResize() {
    this.setSize();
    window.addEventListener("resize", () => this.setSize());
  }

  renderWorld() {
    this.matter.render.run(this.render);
  }
}

new App();
