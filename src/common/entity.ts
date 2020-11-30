import { IGameObject } from "./object";

export interface IEntity extends IGameObject {
    getMoveSpeed(): number;
}
