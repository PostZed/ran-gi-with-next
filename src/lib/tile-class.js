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
export default Tile;
