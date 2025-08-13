import dbConnect from "@/lib/dbConnect";
import Board from "@/lib/tile"
import  Game  from "@/models/RangiBoard";


export async function GET(request: Request, { params }: { params: Promise<{ size: string }> }) {
    let puzzle, entry;
  await dbConnect();
    try {

        let dims: any = (await params).size;
        dims = Number(dims);
        if (!dims || isNaN(dims))
            throw new SyntaxError("Size is not a valid number.");
        puzzle = new Board(dims, dims);
        entry = new Game({ squares: puzzle.boardData, dimensions: dims });
        await entry.save();

        return Response.json({ info: puzzle.boardData, id: entry._id }, {
            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            // }
        });

    } catch (error) {
        console.log(error)
        if (puzzle)
            return Response.json({ info: puzzle.boardData, id: null }, {
                // headers: {
                //     'Access-Control-Allow-Origin': '*',
                //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                // }
            });
        return Response.json({ error }, { status: 500 });
    }

}