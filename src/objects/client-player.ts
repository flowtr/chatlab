import {
    ArcRotateCamera,
    DeviceOrientationCamera,
    Mesh,
    PhysicsImpostor,
    Scene,
    TransformNode,
    Vector3,
    VRDeviceOrientationArcRotateCamera,
    WebXRExperienceHelper,
} from "babylonjs";
import { ClientGame } from "../game";
import { IEntity } from "../common/entity";
import { CharacterController } from "./base-player";

export const createPlayerModel = (scene: Scene) => {
    // Create a sphere that we will be moved by the keyboard
    const model = Mesh.CreateSphere("sphere1", 16, 2, scene);
    model.position.y = 10;
    model.physicsImpostor = new PhysicsImpostor(
        model,
        PhysicsImpostor.SphereImpostor,
        { mass: 1, restitution: 0.9 },
        scene
    );
    return model;
};

export class ClientPlayer extends TransformNode implements IEntity {
    game: ClientGame;
    controller: CharacterController;
    camera: ArcRotateCamera | VRDeviceOrientationArcRotateCamera;
    enableVR: boolean;

    constructor(game: ClientGame, enableVR: boolean) {
        super("player");
        this.enableVR = enableVR;
        const scene = game.getScene();
        if (enableVR)
            this.camera = new VRDeviceOrientationArcRotateCamera(
                "Camera",
                0,
                0,
                10,
                new Vector3(0, 0, 0),
                scene
            );
        else
            this.camera = new ArcRotateCamera(
                "Camera",
                0,
                0,
                10,
                new Vector3(0, 0, 0),
                scene
            );

        this.camera.checkCollisions = true;
        this.camera.parent = this;
        this.camera.attachControl(false);
        this.controller = new CharacterController(
            createPlayerModel(scene),
            this.camera,
            game.getScene(),
            {}
        );
        this.camera.target = this.controller.getAvatar().position;
        this.controller.getAvatar().parent = this;
        this.game = game;
    }

    init() {
        this.controller.start();
    }

    getMoveSpeed() {
        return this.controller.getWalkSpeed();
    }
}
