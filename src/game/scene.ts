"use client";

import { Scene ,Types, CANVAS } from "phaser";
import { Board, Info, Tile } from "./board";

export class RangiGame extends Scene {
    //The dimensions of the board
    static size: number;
    static info: Info[];
    static tileSize: number;
    static canvasWidth: number;
    constructor() {
        super("Ran-gi");
    }

    create() {
        Board.scene = this;
        Tile.scene = this;
        this.makeNewBoard();
    }

    makeNewBoard() {
       // const tileSize = Board.canvasWidth / Board.dims;
        Board.createBoard(/*RangiGame.size, RangiGame.info, tileSize*/);
    }
}

export const config :Types.Core.GameConfig = {
    parent: 'game',
    scene: RangiGame,
    type: CANVAS,
    backgroundColor: 0xffffff,
    input: true,
};