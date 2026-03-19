import { useContext } from "react";
import { GameContext } from "../skeleton";
import { ConfirmButton, TextZone } from "./minor-components";

export function Result() {
    const { hasWon, setGameCount, gameCount, removeModal } = useContext(GameContext);
    const youWin = "Congratulations! You've filled the Ran-gi board!"
    const youLose = "Not quite there! You've made some mistakes. Give the puzzle another look!"
    const youDidntFinish = "You have not completed the puzzle.";

    function makeString() {
        switch (hasWon) {
            case "correct":
                return youWin;
            case "wrong":
                return youLose;
            case "incomplete":
                return youDidntFinish;
        }
    }

    function handleReturnToGame() {
        removeModal();
    }

    function doNewGame() {
        setGameCount(gameCount + 1);
        removeModal();
    }

    return <div className="alerts">
        <TextZone text={makeString()} />
        <div className="flex">
            <ConfirmButton text={"Return to Game"} handler={handleReturnToGame} />
            <ConfirmButton text={"New Game"} handler={doNewGame} />
        </div>
    </div>
}