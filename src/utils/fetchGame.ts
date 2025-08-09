import { Board } from "@/game/board";

const url = process.env.NEXT_PUBLIC_URL;


export async function fetchGame(dimensions: number) {
    try {
        const res = await fetch(`${url}/${dimensions}/board`);
        if (res.ok) {
            const info = (await res.json()).info;
            Board.dims = dimensions;
            Board.info = info;
            Board.createBoard();
        }
        else {
            const e = new Error("Game data not fetched");
            throw e;
        }
    } catch (error) {
        console.log(error)
        throw new Error("Game data not fetched");
    }
}