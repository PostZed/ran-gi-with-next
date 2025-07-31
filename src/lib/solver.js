import { colors, YELLOW, RED, GREEN, BLUE, WHITE, SQ_ONLY, NUM_ONLY, BOTH, EMPTY, HORIZONTAL, VERTICAL, ANY_DIR } from "./constants";
const SOLVED = 1;
const HAS_RANDOM_SOLUTION = 2;
const WILL_TRY_LATER = 3;
const COLOR_NOT_FOUND = 4;
class Solver {
    constructor(cols, rows) {
        (this.cols = cols), (this.rows = rows);
        const z = 500;
    }
    solveBoth(grid, tile) {
        if (1 === tile.count) return void (tile.solved = !0);
        const { verticals: verticals, horizontals: horizontals } = this.getPossiblesBOTH(grid, tile.col, tile.row, tile.count, tile),
            horPaths = this.getHorizontalPaths(horizontals, tile.count, tile.color, grid),
            verPaths = this.getVerticalPaths(verticals, tile.count, tile.color, grid),
            VL = verPaths.length,
            HL = horPaths.length,
            hasOneSolution = (1 === VL && 0 === HL) || (1 === HL && 0 === VL);
        if (!0 === hasOneSolution) {
            const locs = 1 === VL ? verPaths[0] : horPaths[0];
            for (let loc of locs) {
                const { col: col, row: row } = loc,
                    sq = grid[col][row];
                (sq.method = "both"), (sq.og = { col: tile.col, row: tile.row }), (sq.color = tile.color), (sq.solved = !0);
            }
            return 1;
        }
        return { verPaths: verPaths, horPaths: horPaths };
    }
    solveNumOnly(grid, tile) {
        if (1 === tile.count) return this.solveLoneEmpty(grid, tile);
        const { col: col, row: row, count: count } = tile,
            { vers: vers, hors: hors } = this.getPossiblesNUM_ONLY(grid, col, row, count, tile),
            horPaths = this.getHorPathsNUM_ONLY(hors, tile.count, grid),
            verPaths = this.getVerPathsNUM_ONLY(vers, tile.count, grid),
            horOKs = this.filterHorizontals(horPaths, grid),
            verOKs = this.filterVerticals(verPaths, grid),
            HL = horOKs.length,
            VL = verOKs.length,
            hasOneSolution = (1 === VL && 0 === HL) || (1 === HL && 0 === VL);
        if (hasOneSolution) {
            const arr = 0 === VL ? horOKs[0] : verOKs[0];
            let color = this.findColor(arr, grid);
            if (color !== WHITE) {
                for (let locs of arr) {
                    const { col: col, row: row } = locs,
                        sq = grid[col][row];
                    (sq.color = color), (sq.og = { col: tile.col, row: tile.row }), (sq.method = "num_only_simple"), (sq.solved = !0);
                }
                return 1;
            }
            if (((color = this.eliminateColors(arr, grid)), void 0 !== color)) {
                for (let locs of arr) {
                    const { col: col, row: row } = locs,
                        sq = grid[col][row];
                    (sq.color = color), (sq.method = "num_only_elimination"), (sq.og = { col: tile.col, row: tile.row }), (sq.solved = !0);
                }
                return 1;
            }
            return 4;
        }
        return { horOKs: horOKs, verOKs: verOKs };
    }
    solveLoneEmpty(grid, tile) {
        if (tile.solved) return 1;
        let ns = this.getNeighbors(tile.col, tile.row);
        if (((ns = ns.map((item) => grid[item.col][item.row])), tile.hint === EMPTY)) {
            const areAllSafe = ns.every((item, i, arr) => {
                if (item.solved) return !0;
                if ((item.hint === BOTH || item.hint === NUM_ONLY) && 1 === item.count) return !0;
                const dir = item.col === tile.col ? VERTICAL : HORIZONTAL;
                if (item.hint === BOTH || item.hint === SQ_ONLY) {
                    if (dir === HORIZONTAL) {
                        const topIsClear = this.topIsClear(item.col, item.row, item.color, grid);
                        return !1 === topIsClear;
                    }
                    {
                        const sideIsClear = this.sideIsClear(item.col, item.row, item.color, grid);
                        return !1 === sideIsClear;
                    }
                }
                return !1;
            });
            if (!1 === areAllSafe) return 3;
            (tile.count = 1), (tile.hint = NUM_ONLY);
        }
        let cors = ns.map((item) => item.color),
            canFit = 0,
            num;
        for (let cor of colors) -1 === cors.indexOf(cor) && !0 === this.stickerIsLegal(tile.col, tile.row, cor, grid) && canFit++;
        if (canFit >= 2) return 2;
        for (let i = 0; i < colors.length; i++)
            if (-1 === cors.indexOf(colors[i])) {
                num = i;
                break;
            }
        return (tile.color = colors[num]), (tile.method = "lone_empty"), (tile.solved = !0), (this.count = 1), 1;
    }
    getPossiblesNUM_ONLY(grid, col, row, count, tile) {
        let hors = [];
        for (let i = col - (count - 1); i <= col; i++) this.isWithinLimit(i, row) && hors.push({ col: i, row: row });
        hors = hors.filter((item) => {
            const c = item.col,
                r = item.row,
                poss = grid[c][r];
            return (poss.hint !== BOTH && poss.hint !== NUM_ONLY) || poss.count === count;
        });
        let vers = [];
        for (let i = row - (count - 1); i <= row; i++) this.isWithinLimit(col, i) && vers.push({ col: col, row: i });
        return (
            (vers = vers.filter((item) => {
                const c = item.col,
                    r = item.row,
                    poss = grid[c][r];
                return (poss.hint !== NUM_ONLY && poss.hint !== BOTH) || poss.count === count;
            })),
            { vers: vers, hors: hors }
        );
    }
    getHorPathsNUM_ONLY(list, count, grid) {
        let paths = [];
        for (let locs of list) {
            let { col: col, row: row } = locs,
                n = 0,
                cors = [],
                arr = [];
            for (; n < count && this.isWithinLimit(col, row); ) {
                const sq = grid[col][row];
                if (sq.solved) break;
                if ((sq.hint === BOTH || sq.hint === NUM_ONLY) && sq.count !== count) break;
                arr.push({ col: col, row: row }), cors.push(sq.color), col++, n++;
            }
            const hasOnlyOneColor = this.hasOnlyOneColor(cors);
            cors.length === count && !0 === hasOnlyOneColor && paths.push(arr);
        }
        return paths;
    }
    getVerPathsNUM_ONLY(list, count, grid) {
        let paths = [];
        for (let locs of list) {
            let { col: col, row: row } = locs,
                n = 0,
                cors = [],
                arr = [];
            for (; n < count && this.isWithinLimit(col, row); ) {
                const sq = grid[col][row];
                if (sq.solved) break;
                if ((sq.hint === BOTH || sq.hint === NUM_ONLY) && sq.count !== count) break;
                arr.push({ col: col, row: row }), cors.push(sq.color), row++, n++;
            }
            const hasOnlyOneColor = this.hasOnlyOneColor(cors);
            cors.length === count && !0 === hasOnlyOneColor && paths.push(arr);
        }
        return paths;
    }
    hasOnlyOneColor(arr) {
        let prev = void 0;
        for (let chaque of arr)
            if (chaque !== WHITE) {
                if (void 0 !== prev && prev !== chaque) return !1;
                prev = chaque;
            }
        return !0;
    }
    filterHorizontals(paths, grid) {
        let lists = [];
        for (let p of paths) {
            let c = 0;
            const color = this.findColor(p, grid),
                isClear = this.endsAreClear(HORIZONTAL, p, color, grid);
            if (!1 !== isClear) {
                sec: for (let locs of p) {
                    const { col: col, row: row } = locs;
                    if (!1 === this.topIsClear(col, row, color, grid)) break sec;
                    c++;
                }
                c === p.length && lists.push(p);
            }
        }
        return lists;
    }
    filterVerticals(paths, grid) {
        let lists = [];
        for (let p of paths) {
            let c = 0;
            const color = this.findColor(p, grid),
                isClear = this.endsAreClear(VERTICAL, p, color, grid);
            if (!1 !== isClear) {
                sec: for (let locs of p) {
                    const { col: col, row: row } = locs;
                    if (!1 === this.sideIsClear(col, row, color, grid)) break sec;
                    c++;
                }
                c === p.length && lists.push(p);
            }
        }
        return lists;
    }
    findColor(arr, grid) {
        let color;
        for (let c of arr) {
            const { col: col, row: row } = c,
                sq = grid[col][row];
            if (sq.color !== WHITE) return (color = sq.color), color;
        }
        return WHITE;
    }
    getPossiblesBOTH(grid, col, row, count, tile) {
        const color = tile.color;
        let hors = [];
        for (let i = col - (count - 1); i <= col; i++) this.isWithinLimit(i, row) && hors.push({ col: i, row: row });
        hors = hors.filter((item) => {
            const c = item.col,
                r = item.row,
                poss = grid[c][r];
            if ((poss.hint === NUM_ONLY || poss.hint === BOTH) && poss.count !== count) return !1;
            const colorIsOK = poss.color === WHITE || poss.color === color;
            return colorIsOK && this.topIsClear(c, r, color, grid);
        });
        let vers = [];
        for (let i = row - (count - 1); i <= row; i++) this.isWithinLimit(col, i) && vers.push({ col: col, row: i });
        return (
            (vers = vers.filter((item) => {
                const c = item.col,
                    r = item.row,
                    poss = grid[c][r];
                if ((poss.hint === NUM_ONLY || poss.hint === BOTH) && poss.count !== count) return !1;
                const colorIsOK = poss.color === WHITE || poss.color === color;
                return colorIsOK && this.sideIsClear(c, r, color, grid);
            })),
            { verticals: vers, horizontals: hors }
        );
    }
    topIsClear(col, row, color, grid) {
        if (color === WHITE) return !0;
        const top = { col: col, row: row - 1 },
            bot = { col: col, row: row + 1 };
        let locs = [top, bot];
        locs = locs.filter((item) => this.isWithinLimit(item.col, item.row));
        for (let loc of locs) {
            const c = loc.col,
                r = loc.row,
                sq = grid[c][r];
            if (sq.color === color) return !1;
        }
        return !0;
    }
    sideIsClear(col, row, color, grid) {
        if (color === WHITE) return !0;
        const left = { col: col - 1, row: row },
            right = { col: col + 1, row: row };
        let locs = [left, right];
        locs = locs.filter((item) => this.isWithinLimit(item.col, item.row));
        for (let loc of locs) {
            const c = loc.col,
                r = loc.row,
                sq = grid[c][r];
            if (sq.color === color) return !1;
        }
        return !0;
    }
    isWithinLimit(col, row) {
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
    }
    getNeighbors(col, row) {
        let locs = [];
        const up = { col: col, row: row - 1 },
            right = { col: col + 1, row: row },
            down = { col: col, row: row + 1 },
            left = { col: col - 1, row: row };
        return locs.push(up, right, down, left), (locs = locs.filter((item) => item.col >= 0 && item.col < this.cols && item.row >= 0 && item.row < this.rows)), locs;
    }
    getHorizontalPaths(list, count, color, grid) {
        let paths = [];
        for (let item of list) {
            let n = 0,
                arr = [],
                { col: col, row: row } = item;
            for (; n < count && this.isWithinLimit(col, row); ) {
                const sq = grid[col][row];
                if ((sq.hint === NUM_ONLY || sq.hint === BOTH) && sq.count !== count) break;
                if ((sq.color !== WHITE && sq.color !== color) || !0 === sq.solved) break;
                if (!1 === this.topIsClear(col, row, color, grid)) break;
                arr.push({ col: col, row: row }), col++, n++;
            }
            if (0 !== arr.length) {
                const endsAreClear = this.endsAreClear(HORIZONTAL, arr, color, grid);
                arr.length === count && endsAreClear && paths.push(arr);
            }
        }
        return paths;
    }
    getVerticalPaths(list, count, color, grid) {
        let paths = [];
        for (let item of list) {
            let n = 0,
                arr = [],
                { col: col, row: row } = item;
            for (; n < count && this.isWithinLimit(col, row); ) {
                const sq = grid[col][row];
                if ((sq.hint === NUM_ONLY || sq.hint === BOTH) && sq.count !== count) break;
                if ((sq.color !== WHITE && sq.color !== color) || !0 === sq.solved) break;
                if (!1 === this.sideIsClear(col, row, color, grid)) break;
                arr.push({ col: col, row: row }), row++, n++;
            }
            if (0 !== arr.length) {
                const endsAreClear = this.endsAreClear(VERTICAL, arr, color, grid);
                arr.length === count && endsAreClear && paths.push(arr);
            }
        }
        return paths;
    }
    endsAreClear(dir, arr, color, grid) {
        if (color === WHITE) return !0;
        if (dir === HORIZONTAL) {
            const start = arr[0],
                end = arr[arr.length - 1],
                first = { col: start.col - 1, row: start.row },
                last = { col: end.col + 1, row: end.row };
            let locs = [first, last],
                clearCount = 0;
            for (let loc of locs) {
                const isWithin = this.isWithinLimit(loc.col, loc.row);
                if (!1 === isWithin) {
                    clearCount++;
                    continue;
                }
                const sq = grid[loc.col][loc.row];
                (sq.color !== WHITE && sq.color === color) || clearCount++;
            }
            return 2 === clearCount;
        }
        if (dir === VERTICAL) {
            const start = arr[0],
                end = arr[arr.length - 1],
                first = { col: start.col, row: start.row - 1 },
                last = { col: end.col, row: end.row + 1 };
            let locs = [first, last],
                clearCount = 0;
            for (let loc of locs) {
                const isWithin = this.isWithinLimit(loc.col, loc.row);
                if (!1 === isWithin) {
                    clearCount++;
                    continue;
                }
                const sq = grid[loc.col][loc.row];
                (sq.color !== WHITE && sq.color === color) || clearCount++;
            }
            return 2 === clearCount;
        }
    }
    findFirstRelative(tile, grid) {
        let ns = this.getNeighbors(tile.col, tile.row),
            rels = [];
        if (
            (ns.forEach((item) => {
                const sq = grid[item.col][item.row];
                sq.color === tile.color && rels.push(sq);
            }),
            0 !== rels.length)
        ) {
            if (1 === rels.length) {
                const dir = tile.col === rels[0].col ? VERTICAL : HORIZONTAL,
                    rela = rels[0];
                if (dir === HORIZONTAL) {
                    const first = tile.col < rela.col ? tile : rela;
                    return (first.count = tile.count), first;
                }
                {
                    const first = tile.row < rela.row ? tile : rela;
                    return (first.count = tile.count), first;
                }
            }
            if (2 === rels.length) {
                const r1 = rels[0],
                    r2 = rels[1];
                rels.forEach((item) => {
                    (item.num.text = `${tile.count}`), item.num.setVisible(!0);
                });
                const dir = r1.col === r2.col ? VERTICAL : HORIZONTAL;
                if (dir === HORIZONTAL) {
                    const first = r1.col < r2.col ? r1 : r2;
                    return first;
                }
                {
                    const first = r1.row < r2.row ? r1 : r2;
                    return first;
                }
            }
        }
    }
    isInList(x, y, list) {
        for (let i = 0; i < list.length; i++) {
            const col = list[i].col,
                row = list[i].row;
            if (x === col && y === row) return !0;
        }
        return !1;
    }
    lookForColor(arr, grid) {
        const start = arr[0],
            end = arr[arr.length - 1];
        let cors = [],
            { col: col, row: row } = start,
            ns = this.getNeighbors(col, row);
        if (
            ((ns = ns.filter((item) => {
                const { col: col, row: row } = item;
                return !1 === this.isInList(col, row, arr);
            })),
            3 === ns.length &&
                (ns.forEach((item) => {
                    const sq = grid[item.col][item.row];
                    sq.color !== WHITE && cors.push(sq.color);
                }),
                3 === cors.length))
        ) {
            const hasThree = this.hasThreeColors(arr);
            if (hasThree) return this.findThirdColor(cors);
        }
        if (
            ((col = end.col),
            (row = end.row),
            (ns = this.getNeighbors(col, row)),
            (ns = ns.filter((item) => {
                const { col: col, row: row } = item;
                return !1 === this.isInList(col, row, arr);
            })),
            3 === ns.length &&
                (ns.forEach((item) => {
                    const sq = grid[item.col][item.row];
                    sq.color !== WHITE && cors.push(sq.color);
                }),
                3 === cors.length))
        ) {
            const hasThree = this.hasThreeColors(arr);
            if (hasThree) return this.findThirdColor(cors);
        }
    }
    findThirdColor(cors) {
        for (let i = 0; i < colors.length; i++) {
            const cor = colors[i];
            if (-1 === cors.indexOf(cor)) return colors[i];
        }
    }
    eliminateColors(arr, grid) {
        let cors = [];
        const dir = arr[0].col === arr[1].col ? VERTICAL : HORIZONTAL;
        for (let locs of arr) {
            const { col: col, row: row } = locs;
            let p = [];
            p = dir === HORIZONTAL ? this.getTopColors(col, row, grid) : this.getSideColors(col, row, grid);
            for (let color of p) -1 === cors.indexOf(color) && cors.push(color);
        }
        const endColors = this.getEndColors(arr, dir, grid);
        for (let cor of endColors) -1 === cors.indexOf(cor) && cors.push(cor);
        if (3 !== cors.length) return;
        let num;
        for (let i = 0; i < colors.length; i++) -1 === cors.indexOf(colors[i]) && (num = i);
        return colors[num];
    }
    getEndColors(arr, dir, grid) {
        if (dir === HORIZONTAL) {
            const start = arr[0],
                end = arr[arr.length - 1],
                first = { col: start.col - 1, row: start.row },
                last = { col: end.col + 1, row: end.row };
            let locs = [first, last],
                cors = [];
            for (let loc of locs) {
                const isWithin = this.isWithinLimit(loc.col, loc.row);
                if (!1 === isWithin) continue;
                const sq = grid[loc.col][loc.row];
                sq.color !== WHITE && cors.push(sq.color);
            }
            return cors;
        }
        if (dir === VERTICAL) {
            const start = arr[0],
                end = arr[arr.length - 1],
                first = { col: start.col, row: start.row - 1 },
                last = { col: end.col, row: end.row + 1 };
            let locs = [first, last],
                cors = [];
            for (let loc of locs) {
                const isWithin = this.isWithinLimit(loc.col, loc.row);
                if (!1 === isWithin) continue;
                const sq = grid[loc.col][loc.row];
                sq.color !== WHITE && cors.push(sq.color);
            }
            return cors;
        }
    }
    getTopColors(col, row, grid) {
        const top = { col: col, row: row - 1 },
            bot = { col: col, row: row + 1 };
        let locs = [top, bot];
        return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row)).map((item) => grid[item.col][item.row].color)), (locs = locs.filter((item) => item !== WHITE)), locs;
    }
    getSideColors(col, row, grid) {
        const left = { col: col - 1, row: row },
            right = { col: col + 1, row: row };
        let locs = [left, right];
        return (locs = locs.filter((item) => this.isWithinLimit(item.col, item.row)).map((item) => grid[item.col][item.row].color)), (locs = locs.filter((item) => item !== WHITE)), locs;
    }
    hasThreeColors(arr) {
        let cors = [];
        arr.forEach((item) => {
            cors.push(item.color);
        });
        const hasThree = cors.every((item, i, list) => {
            const index = list.indexOf(item, i + 1);
            return -1 === index;
        });
        return hasThree;
    }
    appearsTwice(arr, elem) {
        let count = 0;
        for (let item of arr) item === elem && count++;
        return 2 === count;
    }
    isLoneEmpty(grid, tile) {
        if ((tile.hint === NUM_ONLY && 1 === tile.count) || !0 === tile.solved || tile.hint !== EMPTY || tile.color !== WHITE) return !1;
        let neighbors = this.getNeighbors(tile.col, tile.row);
        neighbors = neighbors.map((item) => grid[item.col][item.row]);
        const isLone = neighbors.every((item) => !0 === item.solved || ((item.hint === NUM_ONLY || item.hint === BOTH) && 1 === item.count) || item.color !== WHITE);
        return isLone;
    }
    gridIsSolved(grid) {
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const sq = grid[i][k];
                if (sq.color === WHITE) return !1;
            }
        return !0;
    }
    checkIfSorroundedByThreeDifferent(grid, tile) {
        if (tile.hint === BOTH || tile.hint === SQ_ONLY || !0 === tile.solved) return !1;
        let ns = this.getNeighbors(tile.col, tile.row);
        ns = ns.map((item) => grid[item.col][item.row]);
        let assigned = 0;
        if (
            (ns.forEach((item) => {
                const isSolved = !0 === item.solved;
                isSolved && assigned++;
            }),
            assigned < 3)
        )
            return !1;
        let cors = [];
        if (
            (ns.forEach((item) => {
                -1 === cors.indexOf(item.fillColor) && item.fillColor !== WHITE && cors.push(item.fillColor);
            }),
            3 !== cors.length)
        )
            return !1;
        const color = this.findThirdColor(cors);
        tile.setFillStyle(color), (tile.solved = !0), tile.hint === EMPTY ? (tile.hint = SQ_ONLY) : tile.hint === NUM_ONLY && (tile.hint = BOTH);
    }
    countSolved(grid) {
        let solved = 0;
        for (let i = 0; i < this.cols; i++)
            for (let k = 0; k < this.rows; k++) {
                const sq = grid[i][k];
                grid[i][k].color !== WHITE && solved++;
            }
        return solved;
    }
    solveAll(grid) {
        let runs = 0,
            solved = 0,
            oldSolved,
            isSolved = !1;
        for (; !1 === isSolved && runs < 5; ) {
            for (let i = 0; i < this.cols; i++)
                for (let k = 0; k < this.rows; k++) {
                    const tile = grid[i][k];
                    void 0 === tile.solved &&
                        (tile.hint === BOTH ? this.solveBoth(grid, tile) : tile.hint === NUM_ONLY && this.solveNumOnly(grid, tile),
                        !0 === this.isLoneEmpty(grid, tile) && this.solveLoneEmpty(grid, tile),
                        this.checkIfLoneUnmarked(grid, tile));
                }
            (isSolved = this.gridIsSolved(grid)), (oldSolved = solved), (solved = this.countSolved(grid)), oldSolved === solved && runs++;
        }
        return isSolved;
    }
    checkIfLoneUnmarked(grid, tile) {
        if (!0 === tile.solved || tile.hint !== SQ_ONLY || tile.color === WHITE) return;
        const list = this.getNeighbors(tile.col, tile.row),
            isLoneUnmarked = list.every((item) => {
                const { col: col, row: row } = item,
                    sq = grid[col][row];
                return !0 === sq.solved || (sq.color !== WHITE && sq.color !== tile.color) || ((sq.hint === NUM_ONLY || sq.hint === BOTH) && 1 === sq.count);
            });
        return !0 === isLoneUnmarked && ((tile.count = 1), (tile.hint = BOTH), (tile.method = "lone_unmarked"), (tile.solved = !0), !0);
    }
    stickerIsLegal(col, row, color, grid) {
        let list = this.getNeighbors(col, row),
            objs = [];
        if (
            (list.forEach((item) => {
                const obj = grid[item.col][item.row];
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
            !1 === this.wouldBeIllegal(dir, sq.color, sq, grid) && (dir === HORIZONTAL ? horTimes++ : verTimes++);
        }
        const isIntersect = !((1 !== verTimes && 2 !== verTimes) || (1 !== horTimes && 2 !== horTimes)),
            isClash = (1 === verTimes && objs.length > 1) || (2 === verTimes && objs.length > 2) || (1 === horTimes && objs.length > 1) || (2 === horTimes && objs.length > 2),
            isIllegal = 0 === horTimes && 0 === verTimes;
        return !1 === isIntersect && !1 === isClash && !1 === isIllegal;
    }
    wouldBeIllegal(dir, color, obj, grid) {
        const { col: col, row: row } = obj;
        if (dir === HORIZONTAL) {
            let neighbors = this.getNeighbors(col, row);
            neighbors = neighbors.filter((item) => item.col === col);
            for (let i = 0; i < neighbors.length; i++) {
                const c = neighbors[i],
                    sq = grid[c.col][c.row];
                if (sq.color === color) return !0;
            }
        }
        if (dir === VERTICAL) {
            let neighbors = this.getNeighbors(col, row);
            neighbors = neighbors.filter((item) => item.row === row);
            for (let i = 0; i < neighbors.length; i++) {
                const c = neighbors[i],
                    sq = grid[c.col][c.row];
                if (sq.color === color) return !0;
            }
        }
        return !1;
    }
}
export default Solver;
