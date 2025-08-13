import dbConnect from "@/lib/dbConnect";
import  Game  from "@/models/RangiBoard";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {

        const id = (await params).id;
        const puzzle = await Game.findById(id);
        if (!puzzle)
            throw new SyntaxError("This puzzle does not exist.");
        return Response.json({info :puzzle.squares , id  }, { status: 200 });
    }
    catch (e: any) {
        if (e instanceof SyntaxError) {
            return Response.json("This puzzle does not exist.", { status: 500 });
        }

        return Response.json("An error occurred. We don't know what happened.", { status: 500 });
    }
}