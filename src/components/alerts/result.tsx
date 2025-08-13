import { useContext } from "react";
import { GameContext } from "../skeleton";
import { ConfirmButton, TextZone } from "./minor-components";
import { Board } from "@/game/board";

export function Result() {
    const { hasWon, setVisible, setGameCount, gameCount , disableBtns} = useContext(GameContext);
    const youWin = "Congratulations! You've filled the Ran-gi board!"
    const youLose = "Not quite there! You've made some mistakes. Give the puzzle another look!"

    function handleReturnToGame() {
        setVisible(false);
        Board.canRespond = true;
        disableBtns(false);
    }

    function doNewGame() {
        setGameCount(gameCount + 1);
      //  Board.canRespond = true;
        disableBtns(false);
        setVisible(false)
    }

    return <div className="alerts">
        <TextZone text={hasWon ? youWin : youLose} />
        <div className="flex">
            <ConfirmButton text={"Return to Game"} handler={handleReturnToGame} />
            <ConfirmButton text={"New Game"} handler={doNewGame} />
        </div>
    </div>
}