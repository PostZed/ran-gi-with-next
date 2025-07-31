import { colors, YELLOW, RED, GREEN, BLUE, WHITE, SQ_ONLY, NUM_ONLY, BOTH, EMPTY, HORIZONTAL, VERTICAL, ANY_DIR } from "./constants";
import  Solver  from "./solver";
const SOLVED = 1;
const HAS_RANDOM_SOLUTION = 2;
const WILL_TRY_LATER = 3;
const COLOR_NOT_FOUND = 4;
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const num = Math.floor(Math.random() * arr.length),
            temp = arr[i];
        (arr[i] = arr[num]), (arr[num] = temp);
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
class ClueFiller {
    constructor(cols, rows) {
        (this.cols = cols), (this.rows = rows);
    }
    makeClues(filledGrid) {
        let guideGrid = this.copyGrid(filledGrid),
            currentClues = [],
            solveGrid = this.createGrid(this.cols, this.rows);
        const solver = new Solver(this.cols, this.rows);
        let runs = 0;
        for (this.solveGrid = solveGrid, this.guideGrid = guideGrid, this.solver = solver, this.putInitialClues(this.solveGrid, this.guideGrid, solver); !1 === solver.solveAll(this.solveGrid); ) {
            (currentClues = this.getAllClueSquares(this.solveGrid)),
                shuffle(currentClues),
                0 === currentClues.length && (this.makeRandomClue(this.solveGrid, this.guideGrid), solver.solveAll(this.solveGrid)),
                (currentClues = this.getAllClueSquares(this.solveGrid));
            for (let tile of currentClues)
                if (void 0 === tile.solved) {
                    const clueType = tile.hint;
                    clueType === BOTH && this.finishSolvingBOTHClue(tile, this.solveGrid, this.guideGrid, solver), clueType === NUM_ONLY && this.finishSolvingNUM_ONLYClue(tile, this.solveGrid, this.guideGrid, solver);
                }
            runs++, this.countSolved(this.solveGrid);
        }
        return this.solveGrid;
    }
    countSolved(solveGrid) {
        let c = 0;
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const sq = solveGrid[i][k];
                !0 === sq.solved && c++;
            }
        return c;
    }
    makeRandomClue(solveGrid, guideGrid) {
        const emptyGroups = this.getEmptyGroups(solveGrid, guideGrid);
        if (0 === emptyGroups.length) return;
        let num = Math.floor(Math.random() * emptyGroups.length);
        const group = emptyGroups[num];
        num = Math.floor(Math.random() * group.selfAndRestLocs.length);
        const { col: col, row: row } = group.selfAndRestLocs[num];
        let CLUESQ = solveGrid[col][row];
        const locs = group.selfAndRestLocs,
            guideSq = guideGrid[col][row];
        CLUESQ.solved ||
            (CLUESQ.hint === SQ_ONLY
                ? ((CLUESQ.count = guideSq.count), CLUESQ.setClue(BOTH, guideSq.color))
                : ((CLUESQ.count = guideSq.count), (num = Math.floor(2 * Math.random())), (num = 0 === num ? BOTH : NUM_ONLY), CLUESQ.setClue(num, guideSq.color)),
            (CLUESQ.isClueSquare = !0));
    }
    getEmptyGroups(solveGrid, guideGrid) {
        let allGroups, emptyGroups;
        return this.getAllGroups(guideGrid).filter((item) => {
            const isEmpty = item.selfAndRestLocs.every((loc) => {
                const { col: col, row: row } = loc,
                    sq = solveGrid[col][row];
                return sq.hint === EMPTY || sq.hint === SQ_ONLY;
            });
            return isEmpty;
        });
    }
    getAllGroups(guideGrid) {
        const list = [],
            rows = this.rows,
            cols = this.cols;
        for (let i = 0; i < cols; i++)
            for (let k = 0; k < rows; k++) {
                const sq = guideGrid[i][k];
                sq.isOrigin && list.push(sq);
            }
        return list;
    }
    expandClue(sq, solveGrid, guideGrid) {
        const guideSq = guideGrid[sq.col][sq.row],
            locs = guideGrid[guideSq.col][guideSq.row].selfAndRestLocs,
            groupHasNoNumClue = locs.every((item) => {
                const sq = solveGrid[item.col][item.row];
                return sq.hint !== NUM_ONLY && sq.hint !== BOTH;
            });
        if (!1 !== groupHasNoNumClue && 0 !== locs.length) {
            let index = locs.findIndex((item) => item.col === sq.col && item.row === sq.row),
                num = Math.floor(Math.random() * locs.length);
            const { col: col, row: row } = locs[num];
            let CLUESQ = solveGrid[col][row];
            CLUESQ.hint === SQ_ONLY
                ? ((CLUESQ.count = guideSq.count), CLUESQ.setClue(BOTH, guideSq.color))
                : ((CLUESQ.count = guideSq.count), (num = Math.floor(2 * Math.random())), (num = 0 === num ? BOTH : NUM_ONLY), CLUESQ.setClue(num, guideSq.color)),
                (CLUESQ.isClueSquare = !0),
                this.solver.solveAll(solveGrid),
                (CLUESQ.isClueSquare = !0);
        }
    }
    finishSolvingNUM_ONLYClue(sq, solveGrid, guideGrid, solver) {
        const tile = sq === solveGrid[sq.col][sq.row] ? sq : solveGrid[sq.col][sq.row];
        let reason = solver.solveAll(solveGrid);
        const guideSq = guideGrid[tile.col][tile.row],
            realColor = guideSq.color,
            locs = guideSq.selfAndRestLocs;
        if (!tile.solved && tile.color === WHITE)
            if (((reason = solver.solveNumOnly(solveGrid, tile)), 1 !== tile.count)) {
                if (4 === reason) {
                    let num = Math.floor(Math.random() * locs.length);
                    const index = locs.findIndex((item) => item.col === tile.col && item.row === tile.row);
                    for (; num === index; ) num = Math.floor(Math.random() * locs.length);
                    const { col: col, row: row } = locs[num],
                        CLUESQ = solveGrid[col][row];
                    CLUESQ.hint === BOTH || CLUESQ.hint === NUM_ONLY ? CLUESQ.setClue(BOTH, realColor) : CLUESQ.setClue(SQ_ONLY, realColor), (CLUESQ.isClueSquare = !0), solver.solveAll(solveGrid);
                } else if ("object" == typeof reason) {
                    const { horOKs: horOKs, verOKs: verOKs } = reason,
                        correctDir = guideSq.dir === HORIZONTAL ? horOKs : verOKs;
                    let correctPath, index;
                    correctDir.forEach((item) => {
                        !0 === this.listsAreIdentical(guideSq.selfAndRestLocs, item) && (correctPath = item);
                    });
                    for (let i = 0; i < correctDir.length; i++)
                        if (correctPath === correctDir[i]) {
                            index = i;
                            break;
                        }
                    correctDir.splice(index, 1);
                    const badLocs = this.getLimitSquares(guideSq.dir, locs, tile.col, tile.row, solveGrid);
                    let i = 0;
                    const { color: color, count: count } = guideSq;
                    for (; void 0 === tile.solved && i < badLocs.length; ) {
                        if (void 0 !== badLocs[i]) {
                            const { col: col, row: row } = badLocs[i];
                            this.placeClueToExcludeNUM_ONLY(color, count, solveGrid, guideGrid, col, row), solver.solveAll(solveGrid);
                        }
                        i++;
                    }
                    let r;
                    if (void 0 === tile.solved) {
                        tile.setClue(BOTH, realColor), solver.solveAll(solveGrid);
                        let lox = [];
                        guideSq.selfAndRestLocs.forEach((item) => lox.push(item));
                        let i = 0;
                        for (; void 0 === tile.solved && i < lox.length; ) {
                            const { col: col, row: row } = lox[i];
                            if (col !== tile.col || row !== tile.row) {
                                const CLUESQ = solveGrid[col][row];
                                CLUESQ.hint === NUM_ONLY || CLUESQ.hint === BOTH ? CLUESQ.setClue(BOTH, realColor) : CLUESQ.setClue(SQ_ONLY, realColor), (CLUESQ.isClueSquare = !0);
                            }
                            i++, solver.solveAll(solveGrid);
                        }
                    }
                }
            } else {
                const sides = this.getSquaresOnSides(tile.col, tile.row, guideGrid),
                    tops = this.getSquaresOnTopAndBottom(tile.col, tile.row, guideGrid),
                    allNs = sides.concat(tops);
                let grid = this.copyGridPlain(solveGrid),
                    nuTile = grid[tile.col][tile.row];
                for (let sq of allNs) {
                    const CLUESQ = grid[sq.col][sq.row],
                        guide = guideGrid[sq.col][sq.row];
                    if (!0 !== CLUESQ.solved && CLUESQ.hint !== BOTH && CLUESQ.hint !== SQ_ONLY) {
                        if (CLUESQ.hint === NUM_ONLY) {
                            if ((CLUESQ.setClue(BOTH, guide.color), (CLUESQ.isClueSquare = !0), solver.solveAll(grid), nuTile.solved)) break;
                            continue;
                        }
                        CLUESQ.setClue(SQ_ONLY, guide.color), solver.solveAll(grid);
                        const hint = CLUESQ.hint;
                        if ((hint === BOTH ? CLUESQ.setClue(SQ_ONLY, guide.color) : this.expandClue(CLUESQ, grid, guideGrid), (CLUESQ.isClueSquare = !0), nuTile.solved)) break;
                    }
                }
                const res = nuTile.solved;
                !0 === res ? (this.solveGrid = grid) : (tile.setClue(BOTH, realColor), (tile.isClueSquare = !0), solver.solveAll(solveGrid));
            }
    }
    placeClueToExcludeNUM_ONLY(color, count, solveGrid, guideGrid, col, row) {
        const sq = guideGrid[col][row],
            CLUESQ = solveGrid[col][row];
        if (!0 === CLUESQ.solved || CLUESQ.hint === BOTH || CLUESQ.hint === SQ_ONLY) return;
        if (CLUESQ.hint === NUM_ONLY) return void (sq.count === count && (CLUESQ.setClue(BOTH, sq.color), (CLUESQ.isClueSquare = !0), this.solver.solveAll(solveGrid)));
        const num = Math.floor(2 * Math.random()) + 1;
        CLUESQ.setClue(SQ_ONLY, sq.color), this.solver.solveAll(solveGrid);
        const hint = CLUESQ.hint;
        hint === BOTH ? CLUESQ.setClue(SQ_ONLY, sq.color) : this.expandClue(CLUESQ, solveGrid, guideGrid), (CLUESQ.isClueSquare = !0);
    }
    finishSolvingBOTHClue(sq, solveGrid, guideGrid, solver) {
        const tile = sq === solveGrid[sq.col][sq.row] ? sq : solveGrid[sq.col][sq.row],
            guideSq = guideGrid[tile.col][tile.row];
        if (1 === tile.count) return (tile.solved = !0), void solver.solveAll(solveGrid);
        let res = solver.solveAll(solveGrid);
        if (tile.solved) return;
        res = solver.solveBoth(solveGrid, tile);
        const { horPaths: horPaths, verPaths: verPaths } = res,
            correctDir = guideSq.dir === HORIZONTAL ? horPaths : verPaths;
        let correctPath, index;
        correctDir.forEach((item) => {
            !0 === this.listsAreIdentical(guideSq.selfAndRestLocs, item) && (correctPath = item);
        });
        for (let i = 0; i < correctDir.length; i++)
            if (correctPath === correctDir[i]) {
                index = i;
                break;
            }
        correctDir.splice(index, 1);
        let i = 0;
        const badLocs = this.getLimitSquares(guideSq.dir, guideSq.selfAndRestLocs, tile.col, tile.row, solveGrid),
            { color: color, count: count } = guideSq;
        let runs = 0;
        for (; void 0 === tile.solved && i < badLocs.length; ) {
            if (void 0 !== badLocs[i]) {
                const { col: col, row: row } = badLocs[i];
                this.placeClueToExclude(color, count, solveGrid, guideGrid, col, row), runs++, solver.solveAll(solveGrid);
            }
            i++;
        }
        const r = tile.solved;
        if (void 0 === r) {
            let lox = [];
            guideSq.selfAndRestLocs.forEach((item) => lox.push(item));
            for (let loc of lox) {
                const { col: col, row: row } = loc;
                if (col !== tile.col || row !== tile.row) {
                    const CLUESQ = solveGrid[col][row];
                    CLUESQ.hint === NUM_ONLY || CLUESQ.hint === BOTH ? CLUESQ.setClue(BOTH, tile.color) : CLUESQ.setClue(SQ_ONLY, tile.color), (CLUESQ.isClueSquare = !0);
                }
                if ((solver.solveAll(solveGrid), tile.solved)) break;
            }
        }
    }
    speedFinish(solveGrid, guideGrid) {
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const clueSq = solveGrid[i][k],
                    guideSq = guideGrid[i][k];
                if (clueSq.fillColor === WHITE) {
                    const cor = guideSq.color;
                    (clueSq.fillColor = cor), clueSq.hint === NUM_ONLY ? clueSq.setClue(BOTH) : clueSq.setClue(SQ_ONLY);
                }
            }
    }
    placeClueToExclude(color, count, solveGrid, guideGrid, col, row) {
        const sq = guideGrid[col][row],
            CLUESQ = solveGrid[col][row];
        if (!0 !== CLUESQ.solved && CLUESQ.hint !== BOTH && CLUESQ.hint !== SQ_ONLY)
            if (CLUESQ.hint !== NUM_ONLY) {
                if (sq.color !== color) {
                    const num = Math.floor(2 * Math.random()) + 1;
                    CLUESQ.setClue(SQ_ONLY, sq.color), this.solver.solveAll(solveGrid);
                    const hint = CLUESQ.hint;
                    hint === BOTH ? CLUESQ.setClue(SQ_ONLY, sq.color) : this.expandClue(CLUESQ, solveGrid, guideGrid), (CLUESQ.isClueSquare = !0);
                }
            } else sq.count === count && (CLUESQ.setClue(BOTH, sq.color), (CLUESQ.isClueSquare = !0), this.solver.solveAll(solveGrid));
    }
    getVicinity(family, grid) {
        const dir = family[0].col === family[1].col ? VERTICAL : HORIZONTAL;
        let locs = [];
        for (let i = 0; i < family.length; i++) {
            const { col: col, row: row } = family[i];
            locs = dir === HORIZONTAL ? locs.concat(this.getSquaresOnTopAndBottom(col, row, grid)) : locs.concat(this.getSquaresOnSides(col, row, grid));
        }
        return (locs = locs.concat(this.getSquaresPastLimits(family, grid))), locs;
    }
    getBadLocs(verPaths, horPaths) {
        const allPaths = verPaths.concat(horPaths);
        let locs = [];
        for (let i = 0; i < allPaths.length; i++) {
            const disPath = allPaths[i];
            for (let k = 0; k < disPath.length; k++) {
                const loc = disPath[k];
                null != loc && locs.push(loc);
            }
        }
        return locs;
    }
    isInList(x, y, list) {
        for (let i = 0; i < list.length; i++) {
            const col = list[i].col,
                row = list[i].row;
            if (x === col && y === row) return !0;
        }
        return !1;
    }
    listsAreIdentical(list1, list2) {
        for (let i = 0; i < list1.length; i++) {
            const { col: col, row: row } = list1[i];
            if (col !== list2[i].col || row !== list2[i].row) return !1;
        }
        return !0;
    }
    createGrid(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let k = 0; k < rows; k++) (grid[i][k] = new Tile(i, k, WHITE)), grid[i][k].setClue(EMPTY);
        }
        return grid;
    }
    copyGridPlain(grid) {
        let nuGrid = [];
        for (let i = 0; i < this.cols; i++) {
            nuGrid[i] = [];
            for (let k = 0; k < this.rows; k++) {
                let copy = new Tile(i, k, WHITE);
                const sq = grid[i][k];
                (copy = Object.assign(copy, sq)), (nuGrid[i][k] = copy);
            }
        }
        return nuGrid;
    }
    copyGrid(grid) {
        let nuGrid = [];
        for (let i = 0; i < this.cols; i++) {
            nuGrid[i] = [];
            for (let k = 0; k < this.rows; k++) {
                let copy = new Tile(i, k, WHITE);
                const sq = grid[i][k],
                    locs = sq.selfAndRest.map((item) => ({ col: item.col, row: item.row }));
                (copy = Object.assign(copy, sq)), (copy.selfAndRestLocs = locs), (nuGrid[i][k] = copy);
            }
        }
        return nuGrid;
    }
    getSquaresPastLimits(arr, grid) {
        if (arr.length >= 2) {
            const dir = arr[0].col === arr[1].col ? VERTICAL : HORIZONTAL;
            if (dir === HORIZONTAL) {
                const start = arr[0],
                    end = arr[arr.length - 1],
                    first = { col: start.col - 1, row: start.row },
                    last = { col: end.col + 1, row: end.row };
                let locs = [first, last];
                return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row))), locs.map((item) => grid[item.col][item.row]);
            }
            {
                const start = arr[0],
                    end = arr[arr.length - 1],
                    first = { col: start.col, row: start.row - 1 },
                    last = { col: end.col, row: end.row + 1 };
                let locs = [first, last];
                return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row))), locs.map((item) => grid[item.col][item.row]);
            }
        }
    }
    getSquaresOnSides(col, row, grid) {
        const left = { col: col - 1, row: row },
            right = { col: col + 1, row: row };
        let locs = [left, right];
        return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row)).map((item) => grid[item.col][item.row])), locs;
    }
    getSquaresOnTopAndBottom(col, row, grid) {
        const top = { col: col, row: row - 1 },
            under = { col: col, row: row + 1 };
        let locs = [top, under];
        return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row)).map((item) => grid[item.col][item.row])), locs;
    }
    isWithinLimit(col, row) {
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
    }
    getLimitSquares(dir, locs, col, row, solveGrid) {
        if (dir === HORIZONTAL) {
            let tops = this.getSquaresOnTopAndBottom(col, row, solveGrid);
            return (tops = tops.concat(this.getSquaresPastLimits(locs, solveGrid))), tops;
        }
        {
            let tops = this.getSquaresOnSides(col, row, solveGrid);
            return (tops = tops.concat(this.getSquaresPastLimits(locs, solveGrid))), tops;
        }
    }
    getAllClueSquares(solveGrid) {
        const currentClues = [],
            rows = this.rows,
            cols = this.cols;
        for (let i = 0; i < cols; i++)
            for (let k = 0; k < rows; k++) {
                const tile = solveGrid[i][k];
                (tile.hint !== BOTH && tile.hint !== NUM_ONLY) || void 0 !== tile.solved || currentClues.push(tile);
            }
        return currentClues;
    }
    putInitialClues(solveGrid, guideGrid) {
        let groups = this.getEmptyGroups(solveGrid, guideGrid);
        const arr = [];
        for (; arr.length < Math.floor(this.cols / 2); ) {
            const num = Math.floor(Math.random() * groups.length);
            arr.push(groups[num]), groups.slice(num, 1);
        }
        arr.forEach((item) => {
            const locs = item.selfAndRestLocs;
            let num = Math.floor(Math.random() * locs.length);
            const { col: col, row: row } = locs[num],
                sq = solveGrid[col][row],
                guideSq = guideGrid[col][row];
            if (sq.hint !== BOTH && !0 !== sq.solved) {
                if (sq.hint === SQ_ONLY) return (sq.count = guideSq.count), sq.setClue(BOTH, guideSq.color), (sq.isClueSquare = !0), void this.solver.solveAll(solveGrid);
                if (sq.hint === NUM_ONLY) return sq.setClue(BOTH, guideSq.color), (sq.isClueSquare = !0), void this.solver.solveAll(solveGrid);
                (num = Math.floor(2 * Math.random())), (num = 0 === num ? NUM_ONLY : BOTH), (sq.count = guideGrid[col][row].count), sq.setClue(num, guideSq.color), (sq.isClueSquare = !0), this.solver.solveAll(solveGrid);
            }
        });
    }
}
export default ClueFiller;
