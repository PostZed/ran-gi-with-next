
import { BOTH, colors, EMPTY, NUM_ONLY, SQ_ONLY, WHITE } from "@/lib/constants"
import { list as tileList } from "../../public/skeletonmain"
import { Board, type FillState, Info as StandardInfo } from "./board"
import { describe, expect, it, test } from '@jest/globals'

function changeTileColor(info: Info) {
    const realColor = info.fillColor
    let badColor: number
    for (const color of colors) {
        if (color !== realColor) {
            badColor = color
            break
        }
    }

    info.fillColor = badColor!
}

function selectAnEmptyCell(cells: Info[]) {
    const index = cells.findIndex(item => /*item.hint === NUM_ONLY || */item.hint === EMPTY)
    return index;
}

function clearOneCell(info: Info) {
    info.fillColor = WHITE
}

function cloneInfoArray(info: Info[]) {
    return info.map(item => ({ ...item }))
}

function editProperties(list: StandardInfo[]) {
    let stringified = JSON.stringify(list)
    stringified = stringified.replaceAll('color', 'fillColor')
    let modifiedList = JSON.parse(stringified)
    modifiedList = modifiedList.map(item => {
        const myColor = item.hint === SQ_ONLY || item.hint === BOTH ? item.fillColor : WHITE
        return { ...item, myColor, myNum: item.count || 0 }
    })
    return modifiedList
}


type Info = Omit<StandardInfo, 'color'> & { myColor: number, fillColor: number }
const list = editProperties(tileList[3].info)
const firstEmptyIndex = selectAnEmptyCell(list)
Board.palette = [...colors, WHITE]

//describe('Board class can correctly determine if a puzzle is correct, incorrect or incomplete', () => {

test('Checks if the board has been incorrectly filled.', () => {
    const badBoard = cloneInfoArray(list)
    changeTileColor(badBoard[firstEmptyIndex])
    Board.list = badBoard

    let result = Board.isCorrect()
    expect(result).toBe('wrong')
}, 3000)


it('Checks if the board is correctly filled', () => {
    const goodBoard = list
    Board.list = goodBoard

    let result = Board.isCorrect()
    expect(result).toBe('correct')
}, 3000)


test('Checks if the board is not entirely filled.', () => {
    const badBoard = cloneInfoArray(list)
    clearOneCell(badBoard[firstEmptyIndex])
    Board.list = badBoard

    let result = Board.isCorrect()
    expect(result).toBe('incomplete')
}, 3000)
// //})


