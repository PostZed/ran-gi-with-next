"use client" ;
import { createContext, useState } from "react";
import TopButtons from "./top-buttons";
import Game from "./game";
import { colors } from "@/lib/constants";


export type GameContextType = {
    dimensions: number;
    colors: number[];
    //  setGameParams: (gameParams: GameContextType) => void
};

export const GameContext = createContext<GameContextType>({
    dimensions: 10,
    colors: colors,
    // setGameParams: (params) => { }
})

const modals = [
    "Palette",
    "Change color",
    "Menu",
    "Win or loss dialog"
]

export default function Skeleton() {
    const prefColors = JSON.parse(window.localStorage.getItem('colors') || "null") || colors;
    const prefDimensions = JSON.parse(window.localStorage.getItem('dimensions') || "null") || 10;
    const [modalShowing , setModalShowing] = useState(false) ;
    const [modal , setModal] = useState("") ;
    const obj = {
        colors: prefColors,
        dimensions: prefDimensions,
        
    }



    return (
        <GameContext value={obj}>
            <TopButtons />
            <Game />
        </GameContext>
    );
}