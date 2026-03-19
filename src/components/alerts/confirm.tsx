import { useContext } from "react";
import { GameContext } from "../skeleton";
import { ConfirmButton, TextZone } from "./minor-components";

export function ConfirmNewGame() {

    const { setGameCount, gameCount, removeModal } = useContext(GameContext);
    const msg = "Are you sure you want to start a new game? ";

    return <div className="alerts">
        <TextZone text={msg} />
        <div className="flex">
            <ConfirmButton text={"Yes"} handler={(e) => {
                removeModal();
                setGameCount(gameCount + 1)
            }} />
            <ConfirmButton text={"Cancel"} handler={(e) => {
                removeModal();
            }} />
        </div>
    </div>
}

