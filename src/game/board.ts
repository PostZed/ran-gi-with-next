"use client";

import { BOTH, colors, EMPTY, NUM_ONLY, SQ_ONLY, WHITE, CSS_COLORS, YELLOW, GREEN, RED, BLUE } from "@/lib/constants";
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

// Helper to convert hex color to CSS string
function hexToCss(hex: number): string {
    if (hex === WHITE) return CSS_COLORS.WHITE;
    if (hex === 0xffff00) return CSS_COLORS.YELLOW;
    if (hex === 0xff0000) return CSS_COLORS.RED;
    if (hex === 65280) return CSS_COLORS.GREEN;
    if (hex === 255) return CSS_COLORS.BLUE;
    return '#' + hex.toString(16).padStart(6, '0');
}

// Convert palette (with WHITE) to CSS colors
export function getCssPalette(palette: number[] | null): string[] {
    if (!palette) return [];
    return palette.map(hex => hexToCss(hex));
}

/** class Board contains static fields and methods that enable interaction the React UI.
 * I'm not sure if this is the best design choice - but it works seamlessly across the two main
 * implementations of the game, so it stays, for now.
 */
export class Board {


    /** Array containing the details of individual tiles as fetched from the server.
     * type Info is a POJO, since it has no logic.
     */
    static info: Info[];
    static dims = 10;
    /** list contains all the tiles used in a game. Tile and Info types are largely identical.
     * However Tile contains more properties and methods. 
    */
    static list: Tile[] = [];

    /** The list of colours that a tile can become as the user clicks it. 
    */
    static palette: number[] | null = null;

    static canRespond = true;
    static onTileClick: ((tile: Tile) => void) | null = null;
    static setTiles: ((tiles: Tile[]) => void) | null = null;

    static changePayloadColors(payload: Info[]): Info[] {
        const stringified = JSON.stringify(payload);
        const info: Info[] = JSON.parse(stringified);
        const savedPalette = this.palette!.slice(0, 4);
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

    static isCorrect(): FillState {
        const grid: (Info | null)[][] = [];
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

        const tempList = this.list.map((tile) => {
            const { col, row, hint, myColor, myNum } = tile;
            let color;
            if (hint === NUM_ONLY || hint === EMPTY) {
                color = WHITE;
            }
            else {
                color = myColor
            }
            const nuTile = { col, row, hint, color, count: myNum ?? 0, isClueSquare: hint === SQ_ONLY || hint === BOTH }
            grid[col][row] = nuTile;
            return nuTile;
        });

        const solver = new Solver(this.dims, this.dims, this.palette!.slice(0, 4));
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
        if (!this.paletteIsDifferent(colorList, this.palette!))
            return;
        const currentPalette = this.palette!.slice(0, 4);
        for (let i = 0; i < this.list.length; i++) {
            const tile = this.list[i];

            if (tile.fillColor !== WHITE) {
                const currentColor = currentPalette.findIndex(c => c === tile.fillColor);
                tile.fillColor = colorList[currentColor];

                if (tile.hint === SQ_ONLY || tile.hint === BOTH)
                    tile.myColor = colorList[currentColor];
            }
            tile.setFillColor(tile.cssFillColor)

        }
        Board.setTiles(this.list)
        this.palette = [...colorList, WHITE];
    }

    static startAgain() {
        this.list.forEach((tile) => {
            if (tile.hint === EMPTY || tile.hint === NUM_ONLY) {
                tile.fillColor = WHITE;
                tile.setFillColor(tile.cssFillColor)
            }
        });
        Board.setTiles(this.list)
        Board.canRespond = true;
    }

    static createBoard() {
        this.canRespond = true;
        const dims = this.dims;
        const info = this.changePayloadColors(this.info);
        this.destroyBoard();

        const tiles: Tile[] = [];
        info.forEach((item) => {
            const { isClueSquare, col, row, hint, color, count } = item;
            const tile = new Tile(col, row, color, hint, count);
            tiles.push(tile);
        });

        this.list = tiles;

        // Notify React to render the tiles
        if (this.setTiles) {
            this.setTiles([...tiles]);
        }
    }

    static destroyBoard() {
        this.list = [];
        if (this.setTiles) {
            this.setTiles([]);
        }
    }

    static handleTileClick(tile: Tile) {
        if (tile.hint === BOTH || tile.hint === SQ_ONLY || Board.canRespond === false)
            return;
        tile.changeColor();
    }
}

export class Tile {
    col: number
    row: number
    myNum?: number;
    myColor: number
    fillColor: number
    palettePos = 0;
    hint: number
    setFillColor: (s: string) => void | null

    constructor(col: number, row: number, color: number, hint: number, num: number) {
        this.col = col;
        this.row = row;
        this.myColor = color;
        this.hint = hint;
        this.fillColor = (hint === SQ_ONLY || hint === BOTH) ? color : WHITE;
        if (hint === NUM_ONLY || hint === BOTH)
            this.myNum = num;
    }

    get isClueSquare(): boolean {
        return this.hint === SQ_ONLY || this.hint === BOTH;
    }

    get showDot(): boolean {
        return this.hint === SQ_ONLY || this.hint === BOTH;
    }

    get showNumber(): boolean {
        return this.hint === BOTH || this.hint === NUM_ONLY;
    }

    get cssFillColor(): string {
        return hexToCss(this.fillColor);
    }

    get cssMyColor(): string {
        return hexToCss(this.myColor);
    }

    /**
     * Changes the color of a cell. Note that palettePos indicates the NEXT colour
     * in the palette, not the current one - so we set `fillColor` to the colour in this.palettePos,
     * then we increase this.palettePos to move it to the next index.
     */
    changeColor() {
        if (!Board.palette) return;
        this.fillColor = Board.palette![this.palettePos]
        this.myColor = this.fillColor
        this.palettePos = (this.palettePos + 1) % 5
    }
}
