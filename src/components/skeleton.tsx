"use client";
import { createContext, Suspense, useState } from "react";
import TopButtons from "./top-buttons";
import Game from "./game";
import { colors, WHITE } from "@/lib/constants";
import Palette from "./modals/ChangePalette";
import { Board } from "@/game/board";
import MenuButtons from "./modals/MenuOptions";
import { ErrorBoundary } from "react-error-boundary";


export type GameContextType = {
    dimensions: number;
    colors: number[];
    setVisible: (b: boolean) => void;
    setModalName: (name: string) => void
};

export const GameContext = createContext<GameContextType>({
    dimensions: 10,
    colors: colors,
    setVisible: (b: boolean) => { },
    setModalName: (name: string) => { }
})

// const modals = [
//     "Palette",
//     "Change color",
//     "Menu",
//     "Win or loss dialog"
// ]
// type ModalMapType = {
//     [key :string] : ()=>React.JSX.N
// }
const modalMap = {
    palette: Palette,
    menu: MenuButtons,
}

function Empty() {
    return <span hidden></span>
}

export default function Skeleton() {
    const prefColors = JSON.parse(window.localStorage.getItem('colors') || "null") || colors;
    const prefDimensions = JSON.parse(window.localStorage.getItem('dimensions') || "null") || 10;
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [modalName, setModalName] = useState(" ");

    /* @ts-expect-error */
    const Modal = isModalShowing && modalName in modalMap ? modalMap[modalName] : Empty;
    //const Modal = modalMap["palette"] ;
    const obj = {
        colors: prefColors,
        dimensions: prefDimensions,
        setVisible: setIsModalShowing,
        setModalName: setModalName
    }

    return (
        <GameContext value={obj}>
            <TopButtons />
            {/* <ErrorBoundary fallback={<h2>Could not fetch game data.</h2>}>
                <Suspense fallback={<h1>Loading game...</h1>}> */}
                 <Game />
                {/* </Suspense>
             </ErrorBoundary> */}
             <Modal />
        </GameContext>
    );
}