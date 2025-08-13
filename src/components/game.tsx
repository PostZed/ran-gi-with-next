'use client'

import { Board, Info } from "@/game/board";
import { Game as PhaserGame } from "phaser";
import { config } from "@/game/scene";
import {  useContext, useEffect, useRef } from "react";
import { GameContext} from "./skeleton";
import { WHITE } from "@/lib/constants";
import useSWR from "swr";
import { GridSkeleton } from "./skeletons/GameLoading";
import { redirect, useRouter } from "next/navigation";


const url = process.env.NEXT_PUBLIC_NETWORK_URL || process.env.NEXT_PUBLIC_URL ;
const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true
}

const fetcher = async (url: string) => {

    const res = await fetch(url);
    if (res.ok) {
        const { info, id } = await res.json();

        return { info, id };
    }
    return new Error("Something died")
}

export default function Game() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { replace, push } = useRouter();

    const { dimensions, colors, id, gameCount, disableBtns, setGameId, setLink } = useContext(GameContext);

    const gameUrl = id && gameCount === 0 ? `${url}/boards/${id}` : `${url}/${dimensions}/board` ;
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
          
            if(Board.palette === null){
            Board.palette = [...colors, WHITE];
            }
            const w = Board.canvasWidth;
            const game = new PhaserGame({ ...config, width: w, height: w });
            disableBtns(false);
            /* @ts-expect-error */
            setGameId(data.id);
            setLink(`${url}/${dimensions}/${data.id}`);
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