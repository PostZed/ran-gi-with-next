"use client";

import { BOTH, colors, EMPTY, NUM_ONLY, SQ_ONLY, WHITE } from "@/lib/constants";
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
    static palette: number[];
    static canRespond = true;
    static newGameCount = 0;

    static changePayloadColors(payload: Info[]) {
        let info = JSON.stringify(payload);
        info = JSON.parse(info);
        const savedPalette = this.palette.slice(0, 4);
        const isDifferent = this.paletteIsDifferent(colors, savedPalette);
        console.log(colors)
        if (!isDifferent)
            return info;

        for (let i = 0; i < info.length; i++) {
            const item = info[i];
            const colorIndex = colors.findIndex(c => c === item.color);
            item.color = savedPalette[colorIndex];
        }
        return info;

    }

    static isCorrect() {
        const isCorrect = this.list.every(item => {
            return item.fillColor === item.myColor;
        });
        return isCorrect;
    }

    static paletteIsDifferent(nuPalette: number[], currentPalette: number[]) {
        nuPalette = Array.from(nuPalette);
        currentPalette = Array.from(currentPalette);
        let count = 0;
        for (let i = 0; i < 4; i++) {
            const color = nuPalette[i];
            const present = currentPalette.findIndex(item => item === color);
            if (present > -1) {
                currentPalette.splice(present, present + 1);
                count++;
            }
        }

        if (count === 4)
            return false;
        return true;
    }

    static changePalette(colorList: number[]) {
        if (!this.paletteIsDifferent(colorList, this.palette))
            return;
        const currentPalette = this.palette.slice(0, 4);
        for (let i = 0; i < this.list.length; i++) {
            const tile = this.list[i];
            if (tile.fillColor !== WHITE) {
                const colorIndex = currentPalette.findIndex(c => c === tile.myColor);
                tile.myColor = colorList[colorIndex]
                const currentColor = currentPalette.findIndex(c => c === tile.fillColor);
                tile.fillColor = colorList[colorIndex];
            }

        }
        //console.log(colorList)
        this.palette = [...colorList, WHITE];
    }

    static startAgain() {
        this.list.forEach((tile) => {
            if (tile.hint === EMPTY || tile.hint === NUM_ONLY)
                tile.fillColor = WHITE;
        });
        Board.canRespond = true;
    }

    static createBoard() {
        this.canRespond = true;
        const dims = this.dims;
        const info = this.changePayloadColors(this.info);
        const width = this.canvasWidth / dims;
        this.destroyBoard();
        Tile.size = width;
        info.forEach((item) => {
            let { isClueSquare, col, row, hint, color, count } = item
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

    col: number
    row: number
    dot: GameObjects.Arc
    numHint: GameObjects.DOMElement;
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
        // if (hint === EMPTY || hint === NUM_ONLY) {
        this.setInteractive();
        this.on("pointerdown", () => {
            console.log(this);
            if (this.hint === BOTH || this.hint === SQ_ONLY || Board.canRespond === false)
                return;
            this.changeColor();
        })
        //  }
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
            // this.numHint = Tile.scene.add.text(this.x + Tile.size / 2, this.y + Tile.size / 2, "", {
            //     color: "#000000", fontSize: `${0.7 * Tile.size}px`
            // }).setOrigin(0.5);

            const estilo = `color:transparent;
            background-clip:text;
            background-color:black;
            font-size: ${0.7 * Tile.size}px;
            font-family:var(--font-geist-mono)`
            this.numHint = Tile.scene.add.dom(this.x + Tile.size / 2, this.y + Tile.size / 2, "div", estilo, "" + this.myNum)
            
        }
    }


    changeColor() {
        if (this.palettePos >= 0 && this.palettePos <= 3) {

            this.fillColor = Board.palette[this.palettePos]
            this.palettePos++;
        }
        else {
            this.fillColor = Board.palette[4];
            this.palettePos = 0;
        }

    }

    destroySelf() {
        this.dot?.destroy(true)
        this.numHint?.destroy(true);
        this.destroy(true);
    }
}



