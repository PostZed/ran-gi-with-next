import dbConnect from "@/lib/dbConnect";
import { ErrorReason } from "@/lib/error-info";
import Game from "@/models/RangiBoard";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

    try {
        await dbConnect();
    } catch (error) {
        return Response.json({
            error: new Error(
                "Error connecting to Ran-gi database.",
                { cause: ErrorReason.FailedDBConnection }
            )
        }, { status: 500 });
    }
    try {

        const id = (await params).id;
        let puzzle;

        puzzle = await Game.findById(id);
        if (!puzzle)
            throw new SyntaxError("This puzzle does not exist.", { cause: ErrorReason.PuzzleIsInexistant });
        return Response.json({ info: puzzle.squares, id }, { status: 200 });


    }
    catch (e) {
        const error = { cause: e.cause }
        if (e instanceof SyntaxError) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json({ error }, { status: 500 });
    }
}