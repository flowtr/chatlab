import {
    CannonJSPlugin,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    PhysicsImpostor,
    Scene,
    Vector3,
    WebXRDefaultExperience,
} from "babylonjs";
import { EventEmitter } from "events";
import { ClientPlayer } from "./objects/client-player";

export class ClientGame extends EventEmitter {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene!: Scene;
    gravityVec: Vector3;
    xr: WebXRDefaultExperience;
    enableXR: any;
    ground: import("babylonjs").Mesh;

    constructor(canvasElement: HTMLCanvasElement) {
        super();
        this._canvas = canvasElement;
        this._engine = new Engine(this._canvas, true);
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
        document.querySelector<HTMLButtonElement>("xrbtn").onclick = () => {
            this.enableXR = !this.enableXR;
            this.setupPlayer();
        };
    }

    async setupPlayer() {
        // TODO: create button
        if (this.enableXR)
            this.xr = await this._scene.createDefaultXRExperienceAsync({
                floorMeshes: [this.ground],
            });

        const player = new ClientPlayer(this, this.enableXR);
        player.init();
    }

    async createScene(): Promise<ClientGame> {
        this._scene = new Scene(this._engine);
        this._scene.collisionsEnabled = true;

        this.gravityVec = new Vector3(0, -9.8, 0);

        const groundOpts = { width: 50, height: 2, depth: 50, subdivisions: 2 };
        this.ground = MeshBuilder.CreateBox(
            "mainground",
            groundOpts,
            this._scene
        );
        this.ground.physicsImpostor = new PhysicsImpostor(
            this.ground,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.1 },
            this._scene
        );
        this.ground.checkCollisions = true;
        this.ground.position.y = -10;

        await this.setupPlayer();
        const lightPos = new Vector3(0, 1, 0);
        new HemisphericLight("hemlight", lightPos, this._scene);

        const physicsPlugin = new CannonJSPlugin();
        this._scene.enablePhysics(this.gravityVec, physicsPlugin);

        return this;
    }

    getScene() {
        return this._scene;
    }

    getCanvas() {
        return this._canvas;
    }

    animate(): ClientGame {
        this._engine.runRenderLoop(() => this._scene.render());
        return this;
    }
}
