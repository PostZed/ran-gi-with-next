import { useContext } from "react";
import { GameContext } from "../skeleton";
import { ConfirmButton, TextZone } from "./minor-components";
import { Board } from "@/game/board";

export function ConfirmNewGame(){

const {setGameCount, gameCount, setVisible, disableBtns} = useContext(GameContext) ;
const msg = "Are you sure you want to start a new game? ";

return <div className="alerts">
<TextZone text={msg}/>
<div className="flex">
    <ConfirmButton text={"Yes"} handler={(e)=>{
        setVisible(false) ;
        disableBtns(false) ;
        setGameCount(gameCount + 1)}}/>
    <ConfirmButton text={"Cancel"} handler={(e)=>{
        setVisible(false) ;
        Board.canRespond = true ;
        disableBtns(false) ;
    }}/>  
</div>
</div>
}

