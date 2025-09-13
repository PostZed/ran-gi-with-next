"use client";
import { createContext, useRef, useState } from "react";
import TopButtons from "./top-buttons";
import Game, { BlurWrapper } from "./game";
import { colors as defaultColors, WHITE } from "@/lib/constants";
import Palette from "./modals/ChangePalette";
import MenuButtons from "./modals/MenuOptions";
import ChangeSize from "./modals/ChangeSize";
import { Result } from "./alerts/result";
import { ConfirmNewGame } from "./alerts/confirm";
import ButtonBar from "./bottom-buttons/bottom-buttons";
import Verifying from "./alerts/verify";
import GameLink from "./modals/Link";
import { FillState } from "@/game/board";
import { Instructions } from "./new-instructions";


export type GameContextType = {
    dimensions: number;
    colors: number[];
    setColors: (n: number[]) => void
    setVisible: (b: boolean) => void;
    setModalName: (name: string) => void;
    setDimensions: (n: number) => void;
    modalName: string;
    isModalShowing: boolean;
    hasWon: FillState;
    setHasWon: (b: FillState) => void,
    disableBtns: (b: boolean) => void,
    btnsDisabled: boolean,
    gameCount: number;
    setGameCount: (n: number) => void;
    gameId: string | null;
    setGameId: (s: string) => void
    link: string;
    setLink: (n: string) => void;

};

export const GameContext = createContext<GameContextType>({
    dimensions: 10,
    colors: defaultColors,
    setColors: (n: number[]) => { },
    setVisible: (b: boolean) => { },
    setModalName: (name: string) => { },
    setDimensions: (n: number) => { },
    modalName: " ",
    isModalShowing: false,
    hasWon: "incomplete",
    setHasWon: (b: FillState) => { },
    disableBtns: (b: boolean) => { },
    btnsDisabled: true,
    gameCount: 0,
    setGameCount: (n: number) => { },
    gameId: undefined,
    setGameId: (str: string) => { },
    link: "",
    setLink: (n: string) => { }
})


const modalMap = {
    palette: Palette,
    menu: MenuButtons,
    "change-dimensions": ChangeSize,
    "winLossAlert": Result,
    "confirm": ConfirmNewGame,
    "verify": Verifying,
    instructions: Instructions,
    link: GameLink
}

function Empty() {
    return null;
}

type SkeletonProps = {
    id?: string;
    size?: number
}

const url = process.env.NEXT_PUBLIC_URL;

export default function Skeleton({ id, size }: SkeletonProps) {

    const [colors, setColors] = useState<number[]>(() => {
        return JSON.parse(window.localStorage.getItem('colors') || "null") || defaultColors;
    });
    const [dimensions, setDimensions] = useState(() => {
        if (id)
            return size;
        return JSON.parse(window.localStorage.getItem('dimensions') || "null") || 10;
    });

    const [isModalShowing, setIsModalShowing] = useState(false);
    const [modalName, setModalName] = useState("");
    const [gameCount, setGameCount] = useState(0);
    const [hasWon, setHasWon] = useState<FillState>("incomplete");
    const [btnsDisabled, disableBtns] = useState(true);
    const [gameId, setGameId] = useState(() => {
        if (id)
            return id;

        return null;
    })
    const [link, setLink] = useState(() => {
        if (id) {
            return `${url}/${size}/${id}`;

        }

        return "";
    });

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
        gameCount, setGameCount,
        hasWon, setHasWon,
        btnsDisabled, disableBtns, gameId,
        setGameId, link, setLink
    }

    return (
        <GameContext value={obj}>
            <TopButtons />

            <BlurWrapper blur={isModalShowing}>
                <Game key={`${gameCount}`} />
            </BlurWrapper>

            {isModalShowing && <Modal />}
            <ButtonBar />
        </GameContext>
    );
}