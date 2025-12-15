import { useContext } from "react";
import { GameContext } from "../skeleton";
import { Board } from "@/game/board";
import { Verify } from "crypto";

export function StartAgain() {
    const { setVisible, setModalName, btnsDisabled } = useContext(GameContext);

    function handleClick() {
        Board.startAgain();
    }

    return <button className="btn flex-1" onClick={handleClick} disabled={btnsDisabled}>
        Start Again
    </button>
}

export function NewGame() {
    const { setVisible, setModalName, btnsDisabled, disableBtns } = useContext(GameContext);

    function handleClick() {
        setVisible(true);
        setModalName("confirm");
        Board.canRespond = false;
        disableBtns(true);
    }

    return <button className="btn flex-1" onClick={handleClick} disabled={btnsDisabled}>
        New Game
    </button>
}

export function CheckBoard() {
    const { setVisible, setModalName, btnsDisabled, disableBtns, setHasWon } = useContext(GameContext);

    function handleClick() {
        setVisible(true);
        setModalName("verify");
        Board.canRespond = false;
        disableBtns(true);
        const isCorrect = Board.isCorrect();
        setHasWon(isCorrect);
    }

    return <button className="btn flex-1" id="check-board" onClick={handleClick} disabled={btnsDisabled}>
        Is It Correct?
    </button>
}

export default function ButtonBar() {
    return <div className="flex mt-4">
        <StartAgain />
        <NewGame />
        <CheckBoard />
    </div>
}