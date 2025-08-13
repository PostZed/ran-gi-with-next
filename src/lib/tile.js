import { colors, YELLOW, RED, GREEN, BLUE, WHITE, SQ_ONLY, NUM_ONLY, BOTH, EMPTY, HORIZONTAL, VERTICAL, ANY_DIR } from "./constants";
import ClueFiller from "./cluefiller";
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const num = Math.floor(Math.random() * arr.length),
            temp = arr[i];
        (arr[i] = arr[num]), (arr[num] = temp);
    }
}

class Board {
    constructor(cols, rows) {
        (this.cols = cols), (this.rows = rows), this.makeAndFilterGrids();
    }
    makeNewGrid() {
        const grid = [];
        for (let i = 0; i < this.cols; i++) {
            grid[i] = [];
            for (let k = 0; k < this.rows; k++) grid[i][k] = void 0;
        }
        this.grid = grid;
    }
    fillGrid() {
        this.gridCount = 0;
        let runs = 0;
        for (; this.gridCount < Math.floor(this.cols * this.rows * 0.8) && runs < 1e4; ) {
            for (let i = 0; i < colors.length; i++) {
                const { v: v, h: h } = this.getPossibleStarts(colors[i]);
                if (0 === v.length && 0 === h.length) continue;
                let zeroArray, otherArray;
                if ((0 === v.length && ((zeroArray = v), (otherArray = h)), 0 === h.length && ((zeroArray = h), (otherArray = v)), zeroArray)) {
                    let rand,
                        start = otherArray[Math.floor(Math.random() * otherArray.length)],
                        { col: col, row: row } = start;
                    this.drawGroup(colors[i], col, row);
                } else {
                    const prob = Math.floor(10 * Math.random()),
                        arr = prob <= 5 ? v : h;
                    let rand,
                        start = arr[Math.floor(Math.random() * arr.length)],
                        { col: col, row: row } = start;
                    this.drawGroup(colors[i], col, row);
                }
                runs++, this.gridIsFull(this.grid, this.cols, this.rows);
            }
            shuffle(colors);
        }
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++)
                if (void 0 === this.grid[i][k]) {
                    (this.grid[i][k] = new Tile(i, k, WHITE)), (this.grid[i][k].originTile = this.grid[i][k]);
                    const myself = this.grid[i][k];
                    myself.selfAndRest = [myself];
                }
        this.finishFill(this.getEmpties(this.grid));
    }
    makeAndFilterGrids() {
        this.makeNewGrid(), this.fillGrid();
        let groups = this.getGroupList(this.grid),
            { isBalanced: isBalanced, vers: vers, hors: hors } = this.isBoardBalanced(groups);
        for (; !isBalanced; )
            this.makeNewGrid(), this.fillGrid(), (groups = this.getGroupList(this.grid)), (isBalanced = this.isBoardBalanced(groups).isBalanced), (vers = this.isBoardBalanced(groups).vers), (hors = this.isBoardBalanced(groups).hors);
        const clueMaker = new ClueFiller(this.cols, this.rows),
            clueGrid = clueMaker.makeClues(this.grid);
        let list = this.gridToArray(clueGrid);
        (list = list.map((item) => {
            item.count || (item.count = 0), item.isClueSquare || (item.isClueSquare = !1);
            if(item.hint === NUM_ONLY || item.hint === EMPTY){
                item.color = WHITE ;
            }
            const { col: col, row: row, color: color, hint: hint, count: count, isClueSquare: isClueSquare } = item,
                pojo = Object.assign({}, { col: col, row: row, color: color, hint: hint, count: count, isClueSquare: isClueSquare });
            return pojo;
        })),
            (this.boardData = list);
    }
    drawGroup(color, col, row) {
        const prob = Math.floor(10 * Math.random());
        let addX = 0,
            addY = 0;
        prob <= 5 ? addX++ : addY++;
        const dir = 1 === addX ? HORIZONTAL : VERTICAL;
        let num = 0,
            prev,
            current,
            UR;
        for (; num < 5 && this.isLegal(col, row, dir, color, num); )
            (current = this.drawOne(color, col, row, num)), 0 === num && (UR = current), void 0 !== prev && ((prev.next = current), (current.prev = prev)), (col += addX), (row += addY), num++, (prev = current);
        return !!UR && (UR.setOriginal(dir), !0);
    }
    drawOne(color, col, row, num) {
        const tile = new Tile(col, row, color);
        return (this.grid[col][row] = tile), tile;
    }
    isWithinLimit(col, row) {
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
    }
    gridIsFull(grid, cols, rows) {
        let count = 0;
        for (let i = 0; i < cols; i++) for (let k = 0; k < rows; k++) void 0 !== grid[i][k] && count++;
        return (this.gridCount = count), count === cols * rows;
    }
    getNeighbors(col, row) {
        let locs = [];
        const up = { col: col, row: row - 1 },
            right = { col: col + 1, row: row },
            down = { col: col, row: row + 1 },
            left = { col: col - 1, row: row };
        return locs.push(up, right, down, left), (locs = locs.filter((item) => item.col >= 0 && item.col < this.cols && item.row >= 0 && item.row < this.rows)), locs;
    }
    getPossibleStarts(color) {
        const cols = this.cols,
            rows = this.rows,
            horLocs = [],
            verLocs = [];
        for (let i = 0; i < cols; i++)
            for (let k = 0; k < rows; k++) void 0 === this.grid[i][k] && (this.isLegal(i, k, HORIZONTAL, color, 0) && horLocs.push({ col: i, row: k }), this.isLegal(i, k, VERTICAL, color, 0) && verLocs.push({ col: i, row: k }));
        return { v: verLocs, h: horLocs };
    }
    isLegal(col, row, dir, color, num) {
        if (!1 === this.isWithinLimit(col, row)) return !1;
        let isClearH, isClearV;
        if (dir === HORIZONTAL) {
            const top = { col: col, row: row - 1 },
                bot = { col: col, row: row + 1 };
            let locs = [top, bot];
            locs = locs.filter((item) => this.isWithinLimit(item.col, item.row));
            let isClear = !0;
            locs.forEach((item) => {
                const elem = this.grid[item.col][item.row];
                void 0 !== elem && elem && elem.color === color && (isClear = !1);
            }),
                (isClearH = !0 === isClear && !0 === this.isOKAt(col + 1, row, color) && !1 === this.hasImmediatePrev(col, row, color, dir, num));
        } else if (dir === VERTICAL) {
            const right = { col: col + 1, row: row },
                left = { col: col - 1, row: row };
            let locs = [left, right];
            locs = locs.filter((item) => this.isWithinLimit(item.col, item.row));
            let isClear = !0;
            locs.forEach((item) => {
                const elem = this.grid[item.col][item.row];
                void 0 !== elem && elem && elem.color === color && (isClear = !1);
            }),
                (isClearV = !0 === isClear && !0 === this.isOKAt(col, row + 1, color) && !1 === this.hasImmediatePrev(col, row, color, dir, num));
        }
        const bool = dir === HORIZONTAL ? isClearH : isClearV;
        return void 0 === this.grid[col][row] && !0 === bool;
    }
    hasImmediatePrev(col, row, color, dir, num) {
        if (0 !== num) return !1;
        let prev;
        if (dir === HORIZONTAL) {
            if (!this.isWithinLimit(col - 1, row) || void 0 === this.grid[col - 1][row]) return !1;
            if (((prev = this.grid[row]), prev.color === color)) return !0;
        }
        if (dir === VERTICAL) {
            if (!this.isWithinLimit(col, row - 1) || void 0 === this.grid[col][row - 1]) return !1;
            if (((prev = this.grid[row - 1]), prev.color === color)) return !0;
        }
    }
    isOKAt(col, row, color) {
        return !1 === this.isWithinLimit(col, row) || void 0 === this.grid[col][row] || this.grid[col][row].color !== color;
    }
    stickerIsLegal(col, row, color) {
        let list = this.getNeighbors(col, row),
            objs = [];
        if (
            (list.forEach((item) => {
                const obj = this.grid[item.col][item.row];
                objs.push(obj);
            }),
            (objs = objs.filter((item) => item.color === color)),
            0 === objs.length)
        )
            return !0;
        let verTimes = 0,
            horTimes = 0;
        for (let i = 0; i < objs.length; i++) {
            const sq = objs[i],
                dir = sq.row === row ? HORIZONTAL : VERTICAL;
            !1 === this.wouldBeIllegal(dir, sq.color, sq) && (dir === HORIZONTAL ? horTimes++ : verTimes++);
        }
        const isIntersect = !((1 !== verTimes && 2 !== verTimes) || (1 !== horTimes && 2 !== horTimes)),
            isClash = (1 === verTimes && objs.length > 1) || (2 === verTimes && objs.length > 2) || (1 === horTimes && objs.length > 1) || (2 === horTimes && objs.length > 2),
            isIllegal = 0 === horTimes && 0 === verTimes;
        return !1 === isIntersect && !1 === isClash && !1 === isIllegal;
    }
    wouldBeIllegal(dir, color, obj) {
        const { col: col, row: row } = obj;
        if (dir === HORIZONTAL) {
            let neighbors = this.getNeighbors(col, row);
            neighbors = neighbors.filter((item) => item.col === col);
            for (let i = 0; i < neighbors.length; i++) {
                const c = neighbors[i],
                    sq = this.grid[c.col][c.row];
                if (sq.color === color) return !0;
            }
        }
        if (dir === VERTICAL) {
            let neighbors = this.getNeighbors(col, row);
            neighbors = neighbors.filter((item) => item.row === row);
            for (let i = 0; i < neighbors.length; i++) {
                const c = neighbors[i],
                    sq = this.grid[c.col][c.row];
                if (sq.color === color) return !0;
            }
        }
        return !1;
    }
    getEmpties(grid) {
        let empties = [];
        const cols = this.cols,
            rows = this.rows;
        for (let i = 0; i < cols; i++)
            for (let k = 0; k < rows; k++) {
                const sq = grid[i][k];
                sq.color === WHITE && empties.push(sq);
            }
        return empties;
    }
    finishFill(empties) {
        mainloop: for (let i = 0; i < empties.length; i++) {
            const sq = empties[i];
            for (let k = 0; k < colors.length; k++) {
                const color = colors[k];
                if (!0 === this.stickerIsLegal(sq.col, sq.row, color)) {
                    sq.color = color;
                    let list = this.getRelatives(sq.col, sq.row, color);
                    if (0 === list.length) {
                        (sq.originTile = sq), (sq.count = 1), (sq.pos = 0), (sq.endTile = sq), (sq.dir = ANY_DIR), (sq.selfAndRest = [sq]), (sq.isOrigin = !0);
                        continue mainloop;
                    }
                    if (2 === list.length) {
                        const dir = list[0].row === sq.row ? HORIZONTAL : VERTICAL;
                        let first, second;
                        dir === HORIZONTAL
                            ? ((first = list[1].col < list[0].col ? list[1] : list[0]), (second = list[1].col > list[0].col ? list[1] : list[0]))
                            : ((first = list[1].row < list[0].row ? list[1] : list[0]), (second = list[1].row > list[0].row ? list[1] : list[0])),
                            sq.unite(first, second);
                    } else if (1 === list.length) {
                        const dir = list[0].row === sq.row ? HORIZONTAL : VERTICAL;
                        let first, second;
                        dir === HORIZONTAL ? ((first = sq.col < list[0].col ? sq : list[0]), (second = sq.col > list[0].col ? sq : list[0])) : ((first = sq.row < list[0].row ? sq : list[0]), (second = sq.row > list[0].row ? sq : list[0])),
                            sq.unite(first, second);
                    }
                    break;
                }
            }
            shuffle(colors);
        }
    }
    getRelatives(col, row, color) {
        let locs = this.getNeighbors(col, row),
            sqs = [];
        return (
            locs.forEach((item) => {
                sqs.push(this.grid[item.col][item.row]);
            }),
            (sqs = sqs.filter((item) => item.color === color)),
            sqs
        );
    }
    isBoardBalanced(list) {
        let hors, vers, ones;
        vers = hors = ones = 0;
        for (const group of list) group.dir !== ANY_DIR && 1 !== group.count ? (group.dir === HORIZONTAL ? hors++ : vers++) : ones++;
        const total = vers + hors + ones,
            bool = vers >= Math.floor(0.5 * hors) && hors >= Math.floor(0.5 * vers);
        return { isBalanced: bool, vers: vers, hors: hors };
    }
    getGroupList(grid) {
        let list = [];
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const sq = grid[i][k];
                sq.isOrigin && -1 === list.indexOf(sq) && list.push(sq);
            }
        return list;
    }
    gridToArray(grid) {
        const list = [];
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const sq = grid[i][k];
                list.push(sq);
            }
        return list;
    }
}
class Tile {
    constructor(col, row, color) {
        (this.col = col), (this.row = row), (this.color = color);
    }
    setOriginal(dir) {
        this.isOrigin = !0;
        let list = [],
            next = this.next,
            count = 1;
        for (list.push(this); next; ) count++, list.push(next), (next = next.next);
        this.selfAndRest = list;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            (item.count = count), (item.selfAndRest = list), (item.originTile = this), (item.endTile = list[count - 1]), (item.dir = dir);
        }
        1 === count && this.dir;
    }
    unite(first, second) {
        let locs = [];
        first.selfAndRest.forEach((item) => {
            locs.push(item);
        }),
            first !== this && second !== this && locs.push(this),
            second.selfAndRest.forEach((item) => {
                locs.push(item);
            });
        const dir = first.col === second.col ? VERTICAL : HORIZONTAL;
        locs.forEach((item) => {
            (item.isOrigin = void 0), (item.count = locs.length), (item.originTile = first.originTile), (item.selfAndRest = locs), (item.dir = dir), (item.endTile = locs[item.count - 1]);
        }),
            (first.originTile.isOrigin = !0);
    }
    setClue(num, color) {
        switch (num) {
            case 3:
                (this.hint = SQ_ONLY), (this.color = color);
                break;
            case 1:
                this.hint = NUM_ONLY;
                break;
            case 0:
                this.hint = EMPTY;
                break;
            case 2:
                (this.hint = BOTH), (this.color = color);
                break;
            default:
                this.hint = BOTH;
        }
    }
}
export default Board;
