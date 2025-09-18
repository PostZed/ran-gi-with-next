import { ErrorReason } from '@/lib/error-info';
import Board from '@/lib/tile';
import { GraphQLError } from 'graphql';
import Game from "@/models/RangiBoard";
import dbConnect from '@/lib/dbConnect';

export async function puzzleData(_, args) {
    let size = args.size;

    if (size && isNaN(Number(size)))
        throw new GraphQLError("Size param should be a number.", {
            extensions: {
                reason: ErrorReason.InvalidSizeParam
            }
        });

    let isConnected = true;
    const puzzle = new Board(size, size);

    try {
        await dbConnect();
    }
    catch (e) {
        isConnected = false;
    }

    let entry;
    // console.log(isConnected, " is Connected?")
    if (isConnected) {
        entry = new Game({ squares: puzzle.boardData, dimensions: size });
        await entry.save();
    }

    return { puzzle: puzzle.boardData, id: entry?._id || null }

}


export async function storedPuzzle(_, args) {
    try {
        await dbConnect();
    } catch (error) {
        throw new GraphQLError("Could not connect to Ran-gi database to fetch requested board.", {
            extensions: {
                reason: ErrorReason.FailedDBConnection
            }
        });
    }


    const id = args.id;
    let puzzle;

    puzzle = await Game.findById(id);
    if (!puzzle)
        throw new GraphQLError("This puzzle does not exist.", {
            extensions:
                { reason: ErrorReason.PuzzleIsInexistant }
        });

    return puzzle.squares;

}

export const resolvers = {
    Query: {
        puzzleData,
        storedPuzzle
    }
}