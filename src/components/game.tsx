'use client'

import { Board, Info } from "@/game/board";
import { Game as PhaserGame } from "phaser";
import { config } from "@/game/scene";
import { useContext, useEffect, useRef } from "react";
import { GameContext } from "./skeleton";
import { WHITE } from "@/lib/constants";
import useSWR from "swr";
import { GridSkeleton } from "./skeletons/GameLoading";
import { redirect, useRouter } from "next/navigation";
import { ErrorReason } from "@/lib/error-info";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { DocumentNode, GraphQLError } from "graphql";


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


export default function Game() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const { dimensions, colors, gameId, gameCount, disableBtns, id, setGameId, setLink } = useContext(GameContext);
    const query = id && gameCount === 0 ? GET_FROM_ID : GET_FROM_SIZE;
    const vars = query === GET_FROM_ID ?
        { variables: { id: id } } : { variables: { size: dimensions } };
    const { data, loading, error } = useQuery(query, { ...vars, fetchPolicy: "network-only" });
    if (gameCount === 1 && id) {
        redirect(`/`);
    }



    useEffect(() => {
        if (data) {
            let puzzle, id;
            const isStored = data.storedPuzzle !== undefined;
            puzzle = isStored ? data.storedPuzzle : data.puzzleData.puzzle;
            id = isStored ? gameId : (data.puzzleData.id || null)
            Board.dims = dimensions;
            Board.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;

            Board.info = puzzle;

            if (Board.palette === null) {
                Board.palette = [...colors, WHITE];
            }
            const w = Board.canvasWidth;
            const game = new PhaserGame({ ...config, width: w, height: w });
            disableBtns(false);

            if (id) {
                setGameId(id);
                setLink(`${url}/${dimensions}/${id}`);
            }

            return () => {
                game.destroy(true);
            }
        }

        if (error) {
            throw new Error(error.message);
        }
    }, [data, error])



    return (
        <div className="w-full aspect-square" id="game" ref={canvasContainerRef}>
            {loading ? <GridSkeleton size={dimensions} /> : null}
        </div>
    )
}

export function BlurWrapper({ blur, children }: { blur: boolean, children: React.ReactNode }) {
    const cn = blur ? "blur-[1px] animate-shrink" : "";
    return <div className={cn}>
        {children}
    </div>
}