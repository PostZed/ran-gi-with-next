'use client'

import { Board, Tile, Info, hexToCss } from "@/game/board";
import { useContext, useEffect, useState, useCallback, useLayoutEffect, useRef, memo } from "react";
import { GameContext } from "./skeleton";
import { WHITE, BOTH, SQ_ONLY, NUM_ONLY } from "@/lib/constants";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { GridSkeleton } from "./skeletons/GameLoading";
import { redirect } from "next/navigation";


const url = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_URL;


const GET_FROM_SIZE = gql`
query FromSize($size:Int!) {
    puzzleData(size : $size){
        puzzle{
           col 
           row
           color
           hint
           isClueSquare
           count
        }
        id
    }
}
`;

const GET_FROM_ID = gql`
query FromId($id:String!){
    storedPuzzle(id:$id){
        col 
        row
        color
        hint
        isClueSquare
        count
    }
}
`;

function TileComponent({ tile, dimensions }: { tile: Tile; onClick?: () => void; dimensions: number }) {
    const isInteractive = tile.hint !== BOTH && tile.hint !== SQ_ONLY;
    const showDot = tile.hint === SQ_ONLY || tile.hint === BOTH;
    const showNumber = tile.hint === BOTH || tile.hint === NUM_ONLY;
    const cellRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState<string>('1em');
    const [fillColor, setFillColor] = useState<string>(tile.cssFillColor);

    // Measure cell size after render and set appropriate font size
    useLayoutEffect(() => {
        if (showNumber) {
            const cellSize = cellRef.current!.getBoundingClientRect().width;
            // For single digits, fill ~80% of cell
            // For double digits (10+), fill ~40% of cell (they're wider)
            const isTwoDigits = tile.myNum !== undefined && tile.myNum >= 10;
            const percentage = isTwoDigits ? 0.4 : 0.8;
            setFontSize(`${cellSize * percentage}px`);
        }
    }, [showNumber, tile.myNum, dimensions]);


    useEffect(() => {
        tile.setFillColor = setFillColor;
    }, [tile])


    const handleClick = () => {
        if (isInteractive) {
            Board.handleTileClick(tile);
            setFillColor(tile.cssFillColor)
        }
    };

    return (
        <div
            className="relative flex items-center justify-center aspect-square h-full cursor-pointer select-none"
            style={{
                backgroundColor: fillColor,
                border: '1px solid #808080',
            }}
            onClick={handleClick}
            ref={cellRef}
            data-testid={`${tile.col} ${tile.row}`}
        >
            {/* Dot indicator for clue squares */}
            {showDot && (
                <div
                    className="absolute rounded-full"
                    style={{
                        backgroundColor: '#000000',
                        width: '8%',
                        height: '8%',
                        bottom: '10%',
                        right: '10%'
                    }}
                />
            )}

            {/* Number hint */}
            {showNumber && tile.myNum !== undefined && (
                <span
                    className="text-black font-mono"
                    style={{
                        fontSize: fontSize,
                        color: 'transparent',
                        backgroundClip: 'text',
                        backgroundColor: 'black'
                    }}
                >
                    {tile.myNum}
                </span>
            )}
        </div>
    );
}


export default function Game() {
    const [tiles, setTiles] = useState<Tile[]>([]);

    const { dimensions, colors, gameId, gameCount, disableBtns, id, setGameId, setLink } = useContext(GameContext);
    const query = id && gameCount === 0 ? GET_FROM_ID : GET_FROM_SIZE;
    const vars = query === GET_FROM_ID ?
        { variables: { id: id } } : { variables: { size: dimensions } };
    const { data, loading, error } = useQuery(query, { ...vars, fetchPolicy: "network-only" });

    /** If the user presses `New Game` after having loaded a stored game,
     * redirect them to the home page.
     */
    if (gameCount === 1 && id) {
        redirect(`/`);
    }

    // Set up the board's render callback
    useEffect(() => {
        Board.setTiles = setTiles;
        return () => {
            Board.setTiles = null;
        };
    }, []);

    useEffect(() => {
        if (data) {
            const isStored = (data as Record<string, unknown>).storedPuzzle !== undefined;
            const puzzle = isStored
                ? (data as Record<string, unknown>).storedPuzzle
                : (data as Record<string, { puzzle: unknown }>).puzzleData.puzzle;
            const puzzleId = isStored
                ? gameId
                : ((data as Record<string, { id: string | null }>).puzzleData.id || null);
            Board.dims = dimensions;
            Board.info = puzzle as Info[];

            if (Board.palette === null) {
                Board.palette = [...colors, WHITE];
            }

            disableBtns(false);

            if (puzzleId) {
                setGameId(puzzleId);
                setLink(`${url}/${dimensions}/${puzzleId}`);
            }

            // Create the board - this will trigger setTiles via the callback
            Board.createBoard();
        }

        if (error) {
            throw new Error(error.message);
        }
    }, [data, error, dimensions, gameId, setGameId, setLink]);

    const handleTileClick = useCallback((tile: Tile) => {
        Board.handleTileClick(tile);
    }, []);


    if (loading) return (
        <div className="w-full aspect-square">
            <GridSkeleton size={dimensions} />
        </div>
    )

    else return <div
        className="w-full aspect-square grid"
        style={{
            gridTemplateColumns: `repeat(${dimensions}, 1fr)`,
            gridTemplateRows: `repeat(${dimensions}, 1fr)`
        }}
    >
        {
            tiles.map((tile) => (
                <TileComponent
                    key={`${tile.col}-${tile.row}`}
                    tile={tile}
                    onClick={() => handleTileClick(tile)}
                    dimensions={dimensions}
                />
            ))
        }
    </div>
}

export function BlurWrapper({ blur, children }: { blur: boolean, children: React.ReactNode }) {
    const cn = blur ? "blur-[1px] animate-shrink" : "";
    return <div className={cn}>
        {children}
    </div>
}
