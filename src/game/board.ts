"use client";

import { BOTH, colors, EMPTY, NUM_ONLY, SQ_ONLY, WHITE } from "@/lib/constants";
import { GameObjects, Scene } from "phaser";
import Solver from './solver'

export type Info = {
    isClueSquare: boolean,
    col: number,
    row: number,
    hint: number,
    color: number,
    count: number
}

export type FillState = "correct" | "wrong" | "incomplete"

export class Board {
    static info: any[];
    static scene: Phaser.Scene;
    static dims = 10;
    static list: Tile[] = [];
    static canvasWidth: number;
    static palette: number[] | null = null;
    static canRespond = true;
    static newGameCount = 0;


    static changePayloadColors(payload: Info[]) {
        let info = JSON.stringify(payload);
        info = JSON.parse(info);
        const savedPalette = this.palette.slice(0, 4);
        const isDifferent = this.paletteIsDifferent(colors, savedPalette);

        if (!isDifferent)
            return info;

        for (let i = 0; i < info.length; i++) {
            const item = info[i];
            const colorIndex = colors.findIndex(c => c === item.color);
            item.color = savedPalette[colorIndex];
        }
        return info;

    }

    // static isCorrect() {
    //     const isCorrect = this.list.every(item => {
    //         return item.fillColor === item.myColor;
    //     });
    //     return isCorrect;
    // }

    static isCorrect(): FillState {
        let grid: any = [];
        for (let col = 0; col < this.dims; col++) {
            grid[col] = []
            for (let row = 0; row < this.dims; row++) {
                grid[col][row] = null
            }
        }

        const isFilled = this.list.every((tile) => {
            return tile.fillColor !== WHITE;
        });
        if (!isFilled)
            return "incomplete";

        let tempList = this.list.map((tile) => {
            const { col, row, hint, myColor, myNum } = tile;
            let color;
            if (hint === NUM_ONLY || hint === EMPTY) {
                color = WHITE;
            }
            else {
                color = myColor
            }
            const nuTile = { col, row, hint, color, count: myNum ? myNum : undefined }
            grid[col][row] = nuTile;
            return nuTile;
        });

        const solver = new Solver(this.dims, this.dims, this.palette.slice(0, 4));
        solver.solveAll(grid);

        const isCorrect = this.list.every((tile, i) => {
            return tile.fillColor === tempList[i].color;
        });

        if (isCorrect)
            return "correct";
        return "wrong";
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
                const currentColor = currentPalette.findIndex(c => c === tile.fillColor);
                tile.fillColor = colorList[currentColor];
                if (tile.hint === SQ_ONLY || tile.hint === BOTH)
                    tile.myColor = colorList[currentColor];
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
        this.setStrokeStyle(1, 0x808080)
        // if (hint === EMPTY || hint === NUM_ONLY) {
        this.setInteractive();
        this.on("pointerdown", () => {
            console.log(`Square at column ${this.col} and row ${this.row}`)
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
            const fontSize = this.myNum < 10 ? 0.7 * Tile.size : 0.35 * Tile.size
            const estilo = `color:transparent;
            background-clip:text;
            background-color:black;
            font-size: ${fontSize}px;
            font-family:Georgia`
            this.numHint = Tile.scene.add.dom(this.x + Tile.size / 2, this.y + Tile.size / 2, "div", estilo, "" + this.myNum)
            this.numHint.node.setAttribute("inert", "true");
        }
    }


    changeColor() {
        if (this.palettePos >= 0 && this.palettePos <= 3) {

            this.fillColor = Board.palette![this.palettePos]
            this.setFillStyle(Board.palette![this.palettePos], 1)
            this.palettePos++;
        }
        else {
            this.fillColor = Board.palette![4];
            this.setFillStyle(Board.palette![this.palettePos], 1)
            this.palettePos = 0;
        }

    }

    destroySelf() {
        this.dot?.destroy(true)
        this.numHint?.destroy(true);
        this.destroy(true);
    }
}



