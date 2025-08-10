"use client";
import { createContext, Suspense, useRef, useState } from "react";
import TopButtons from "./top-buttons";
import Game, { BlurWrapper } from "./game";
import { colors as defaultColors, WHITE } from "@/lib/constants";
import Palette from "./modals/ChangePalette";
import { Board } from "@/game/board";
import MenuButtons from "./modals/MenuOptions";
import { ErrorBoundary } from "react-error-boundary";
import ChangeSize from "./modals/ChangeSize";
import { Result } from "./alerts/result";
import { ConfirmNewGame } from "./alerts/confirm";
import ButtonBar from "./bottom-buttons/bottom-buttons";
import Verifying from "./alerts/verify";


export type GameContextType = {
    dimensions: number;
    colors: number[];
    setVisible: (b: boolean) => void;
    setModalName: (name: string) => void;
    setDimensions: (n: number) => void;
    modalName: string;
    isModalShowing:boolean;
    colorBarParent: { current: HTMLElement | null };
    hasWon : boolean;
    setHasWon:(b:boolean)=>void,
    disableBtns:(b:boolean)=>void,
    btnsDisabled : boolean,
    gameCount:number;
    setGameCount:(n:number)=>void
};

export const GameContext = createContext<GameContextType>({
    dimensions: 10,
    colors: defaultColors,
    setVisible: (b: boolean) => { },
    setModalName: (name: string) => { },
    setDimensions: (n: number) => { },
    modalName: " ",
    isModalShowing:false,
    colorBarParent: { current: null },
    hasWon : false ,
    setHasWon:(b:boolean)=>{},
    disableBtns:(b:boolean)=>{},
    btnsDisabled:true,
    gameCount:0,
    setGameCount:(n:number)=>{}
})


const modalMap = {
    palette: Palette,
    menu: MenuButtons,
    "change-dimensions": ChangeSize,
    "winLossAlert":Result,
    "confirm" : ConfirmNewGame,
    "verify" : Verifying
}

function Empty() {
    return null;
}

export default function Skeleton() {

    const [colors, setColors] = useState<number[]>(() => {
        return JSON.parse(window.localStorage.getItem('colors') || "null") || defaultColors;
    });
    const [dimensions, setDimensions] = useState(() => {
        return JSON.parse(window.localStorage.getItem('dimensions') || "null") || 10;
    });
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [modalName, setModalName] = useState("");
    const [gameCount,setGameCount] = useState(0) ;
    const [hasWon,setHasWon] = useState(false) ;
    const [btnsDisabled,disableBtns] = useState(true) ;
    const colorBarRef = useRef(null);

    /* @ts-expect-error */
    const Modal = isModalShowing && modalName in modalMap ? modalMap[modalName] : Empty;
    //const Modal = modalMap["palette"] ;
    const obj = {
        colors,
        dimensions,
        setVisible: setIsModalShowing,
        setModalName: setModalName,
        setDimensions, setColors,
        modalName,
        isModalShowing,
        colorBarParent: colorBarRef,
        gameCount,setGameCount,
        hasWon,setHasWon,
        btnsDisabled,disableBtns
    }

    return (
        <GameContext value={obj}>
            <TopButtons ref={colorBarRef} />
           
           <BlurWrapper blur={isModalShowing}>
                <Game key={`${gameCount}`} />
            </BlurWrapper>
         
            {isModalShowing && <Modal />}
            <ButtonBar />
        </GameContext>
    );
}