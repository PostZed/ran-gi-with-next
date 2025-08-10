import Board from "@/lib/tile"

export async function GET(request: Request, { params }: { params: Promise<{ size: string }> }) {
    try {
        let dims: any = (await params).size;
        dims = Number(dims);
        const puzzle = new Board(dims, dims);
        // console.log(puzzle.boardData)

        return Response.json({ info: puzzle.boardData }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            }
        });

    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }

}