'use client'

import { Board, Info } from "@/game/board";
import { Game as PhaserGame } from "phaser";
import { config, RangiGame } from "@/game/scene";
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameContext, GameContextType } from "./skeleton";
import { WHITE } from "@/lib/constants";
import useSWR from "swr";
import { ErrorBoundary } from "react-error-boundary";
import GameLoading, { GridSkeleton } from "./skeletons/GameLoading";

const url = process.env.NEXT_PUBLIC_URL;
const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false

}

const fetcher = async (url: string) => {

    const res = await fetch(url);
    if (res.ok) {
        const info = (await res.json()).info;
        return info;
    }
    return new Error("Something died")
}
export default function Game() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { dimensions, colors, isModalShowing, disableBtns, gameCount } = useContext(GameContext);
    const { data, error, isLoading } = useSWR(
        `http://localhost:3000/${dimensions}/board`,
        fetcher, options
    )

    useEffect(() => {
        if (data) {
            Board.dims = dimensions;
            Board.newGameCount = gameCount;
            Board.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;
            Board.info = data;
            Board.palette = [...colors, WHITE];
            const w = Board.canvasWidth;
            const game = new PhaserGame({ ...config, width: w, height: w });
            disableBtns(false)

            return () => {
                game.destroy(true);
            }
        }
    }, [data]);



    return (
        <div className="w-full aspect-square" id="game" ref={canvasContainerRef}>
            {data ? null : <GridSkeleton size={dimensions} />}
            {/* <span>{gameCount}</span> */}
        </div>
    )
}

export function BlurWrapper({ blur, children }: { blur: boolean, children: React.ReactNode }) {
    const cn = blur ? "blur-[1px] animate-shrink" : "";
    return <div className={cn}>
        {children}
    </div>
}