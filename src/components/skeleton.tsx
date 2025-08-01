"use client" ;
import { createContext, DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_MEDIA_SRC_TYPES, Suspense, useState } from "react";
import TopButtons from "./top-buttons";
import Game from "./game";
import { colors, WHITE } from "@/lib/constants";
import Palette from "./modals/ChangePalette";
import { Board } from "@/game/board";
import MenuButtons from "./modals/MenuOptions";


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
    return <></>
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
            <Suspense fallback={<h1>This may take long!</h1>}>
<Game />
            </Suspense>
            <Modal />

        </GameContext>
    );
}