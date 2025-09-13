import dbConnect from "@/lib/dbConnect";
import { ErrorReason } from "@/lib/error-info";
import Board from "@/lib/tile"
import Game from "@/models/RangiBoard";


export async function GET(request: Request, { params }: { params: Promise<{ size: string }> }) {
    let puzzle, entry;
    let isConnected = true;
    try {
        await dbConnect();
    } catch (error) {
        isConnected = false;
    }
    try {

        let dims: any = (await params).size;
        dims = Number(dims);
        if (!dims || isNaN(dims))
            throw new SyntaxError("Invalid size param.", { cause: ErrorReason.InvalidSizeParam });
        puzzle = new Board(dims, dims);

        if (isConnected) {
            entry = new Game({ squares: puzzle.boardData, dimensions: dims });
            await entry.save();
        }
        console.log("Data fetched");
        return Response.json({ info: puzzle.boardData, id: entry?._id || null }, {
            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            // }
        });

    } catch (e) {
        console.log(e)
        const error = { cause: e.cause }
        return Response.json({ error }, { status: 500 });
    }

}