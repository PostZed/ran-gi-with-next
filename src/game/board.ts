"use client";

import { BOTH, EMPTY, NUM_ONLY, SQ_ONLY, WHITE } from "@/lib/constants";
import { GameObjects, Scene } from "phaser";

export type Info = {
    isClueSquare: boolean,
    col: number,
    row: number,
    hint: number,
    color: number,
    count: number
}

export class Board {
    static info: any[];
    static scene: Scene;
    static dims = 10;
    static list: Tile[] = [];
    static canvasWidth: number;


    static createBoard(/*dims: number, info: Info[], width: number*/) {
        const dims = this.dims;
        const info = this.info ;
        const width = this.canvasWidth / dims ;
        this.destroyBoard();
        Tile.size = width;
        info.forEach((item) => {
            const { isClueSquare, col, row, hint, color, count } = item
            const tile = new Tile(col, row, color, hint, count);
            this.list.push(tile);
        });
    }

    static destroyBoard() {

        this.list?.forEach(tile => tile.destroySelf());
        this.list = [];
    }

}


export class Tile extends GameObjects.Rectangle {
    static scene: Scene;
    static size: number
    static palette: number[]
    col: number
    row: number
    dot: GameObjects.Arc
    numHint: GameObjects.Text
    myNum: number;
    myColor: number
    palettePos = 0;
    hint: number
    constructor(col: number, row: number, color: number, hint: number, num: number) {
        const size = Tile.size;
        super(Tile.scene, col * size, row * size, size, size, color);
        this.setOrigin(0);
        this.myColor = color;
        Tile.scene.add.existing(this);
        this.col = col;
        this.row = row;
        this.hint = hint;
        //   this.setInteractive(true)
        if (hint === NUM_ONLY || hint === BOTH)
            this.myNum = num;
        this.setHints(hint);
    }

    setHints(hint: number) {
        let offsetX = this.x + this.width - (0.1 * this.width);
        let offsetY = this.y + this.width - (0.1 * this.width)
        this.fillColor = WHITE;
        if (hint === EMPTY)
            return;

        if (hint === SQ_ONLY || hint === BOTH) {
            this.dot = Tile.scene.add.circle(offsetX, offsetY, 0.05 * this.width, 0x000000);
            this.fillColor = this.myColor;
        }

        if (hint === BOTH || hint === NUM_ONLY) {
            this.numHint = Tile.scene.add.text(this.x + Tile.size / 2, this.y + Tile.size / 2, this.myNum + "", {
                color: "#000000", fontSize: `${0.7 * Tile.size}px`
            }).setOrigin(0.5);
        }
    }

    handleClick() {
        this.changeColor();
    }

    changeColor() {
        if (this.palettePos === 0)
            this.palettePos++;

        else if (this.palettePos !== 0 && this.palettePos % 4 === 0)
            this.fillColor = Tile.palette[0];

        else
            this.fillColor = Tile.palette[++this.palettePos];
    }

    destroySelf() {
        this.dot?.destroy(true)
        this.numHint?.destroy(true);
        this.destroy(true);
    }
}



