'use client'

import { Board, Info } from "@/game/board";
import { Game as PhaserGame } from "phaser";
import { config, RangiGame } from "@/game/scene";
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameContext, GameContextType } from "./skeleton";
import { WHITE } from "@/lib/constants";
import useSWR from "swr";
import { ErrorBoundary } from "react-error-boundary";

const url = process.env.NEXT_PUBLIC_URL;

const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const info = (await res.json()).info;
            return info;
        }
    } catch (error) {
        return { error };
    }
}
export default function Game(
    //     {
    //     dimensions,
    //     colors,
    //     setVisible,
    //     setModalName
    // }: GameContextType
) {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { dimensions, colors } = useContext(GameContext);
    const { data, error, isLoading } = useSWR(
        `http://localhost:3000/${dimensions}/board`,
        fetcher
    )

    useEffect(() => {
        if (data)
            Board.dims = dimensions;
        Board.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;
        Board.info = data;
        Board.palette = [WHITE, ...colors];
        const w = Board.canvasWidth;
        new PhaserGame({ ...config, width: w, height: w });
    }, [data]);



    return (
        <ErrorBoundary fallback={<h2>Could not fetch game data.</h2>}>
            <Suspense fallback={<h1>Loading game...</h1>}>
                <div className="w-full" id="game" ref={canvasContainerRef}>
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}