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


const url = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_URL;
const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
    shouldRetryOnError: false
}

const fetcher = async (url: string) => {

    const res = await fetch(url);
    if (res.ok) {
        const { info, id } = await res.json();

        return { info, id };
    }

    if (res.status === 500) {
        let cause = await res.json();
        cause = cause.error.cause;
        let message;
        switch (cause) {
            case ErrorReason.FailedDBConnection:
                message = "Could not access the Ran-gi database. Try again later, \
                           and if the issue persists, the problem is likely on our side."
                break;
            case ErrorReason.InvalidSizeParam:
                message = "Could not access the Ran-gi server. The problem is likely \
                on our side.";
                break;

            case ErrorReason.PuzzleIsInexistant:
                message = "The requested puzzle doesn't exist, or was not saved to our \
                databases. You may also have copied a wrong \
                link or invented your own."
                break;
            default:
                message = "Unknown server error."
        }
        throw new Error(message);
    }
    throw new Error("An unknown server error occurred.")

}

export default function Game() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const { dimensions, colors, gameId, gameCount, disableBtns, id, setGameId, setLink } = useContext(GameContext);
    const gameUrl = gameId && gameCount === 0 ? `${url}/boards/${gameId}` : `${url}/${dimensions}/board`;
    //const gameUrl = gameId && gameCount === 0 ? `${url}/boards/${gameId}` : `${url}/t/board`;
    if (gameCount === 1 && id) {
        redirect(`/${dimensions}`);
    }

    const { data, error, isLoading } = useSWR(
        gameUrl,
        // 'http://192.168.0.158:3000/10/board',
        fetcher, options
    )

    useEffect(() => {
        if (data) {
            Board.dims = dimensions;
            Board.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;
            /* @ts-expect-error */
            Board.info = data.info;

            if (Board.palette === null) {
                Board.palette = [...colors, WHITE];
            }
            const w = Board.canvasWidth;
            const game = new PhaserGame({ ...config, width: w, height: w });
            disableBtns(false);
            /* @ts-expect-error */
            if (data.id) {
                setGameId(data.id);
                setLink(`${url}/${dimensions}/${data.id}`);
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
            {isLoading ? <GridSkeleton size={dimensions} /> : null}
        </div>
    )
}

export function BlurWrapper({ blur, children }: { blur: boolean, children: React.ReactNode }) {
    const cn = blur ? "blur-[1px] animate-shrink" : "";
    return <div className={cn}>
        {children}
    </div>
}