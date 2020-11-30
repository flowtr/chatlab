import { ClientGame } from "./game";

const game = new ClientGame(
    document.querySelector<HTMLCanvasElement>("#renderCanvas")
);
game.createScene().then((game) => game.animate());
