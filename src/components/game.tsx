'use client'

import { Board, Info } from "@/game/board";
import {Game as PhaserGame} from "phaser" ;
import { config, RangiGame } from "@/game/scene";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "./skeleton";

const url = process.env.NEXT_PUBLIC_URL;

export default function Game() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const { dimensions, colors } = useContext(GameContext);


    useEffect(() => {
        async function initGame() {
            try {
                const res = await fetch(`${url}/${dimensions}/board`);
                if (res.ok) {
                    // RangiGame.size = dimensions;
                    // RangiGame.info = (await res.json()).info;
                    // RangiGame.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;
                  //  RangiGame.tileSize = canvasContainerRef!.current!.getBoundingClientRect().width / dimensions;
                  Board.dims = dimensions ;
                  Board.canvasWidth = canvasContainerRef!.current!.getBoundingClientRect().width;
                  Board.info = (await res.json()).info;
                  const w = Board.canvasWidth ;
                    new PhaserGame({...config, width :w, height:w});
                }
                else throw new Error("Game data not fetched");
            } catch (error) {
              //  setError(true);
              throw new Error("Error accessing game data.")
            }
        }
        initGame();
    }, []);



    return (
        <div className="w-full" id="game" ref={canvasContainerRef}>
        </div>
    );
}