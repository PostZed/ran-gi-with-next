import { useContext } from "react";
import { GameContext, GameContextType } from "../skeleton";
import {
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Board } from "@/game/board";

type OptionsType = {
    title: string;
    componentKey: string
}

const optionsMap: OptionsType[] = [
    { title: "Change palette", componentKey: "palette" },
    { title: "Change board dimensions", componentKey: "change-dimensions" },
    { title: "Get game link", componentKey: "" }
]

export default function MenuButtons(
    //     {
    //     dimensions,
    //     colors,
    //     setVisible,
    //     setModalName
    // }: GameContextType
) {
    const { setVisible, setModalName, disableBtns } = useContext(GameContext);
    const myName = "menu";

    return (<div className="max-w-7/10 h-fit bg-gray-200 absolute right-0 top-0 border">
        <div className="flex justify-between h-8 items-center">
            <h3 className="h-9/10">Menu</h3>
            <button className="appearance-none hover:border" onClick={() => {
                Board.canRespond = true ;
                setVisible(false);
                disableBtns(false) ;
            }
            }>
                <XMarkIcon className="w-7" />
            </button>
        </div>
        <div>
            {optionsMap.map(option => {
                return <li key={option.title} className="bg-gray-100 list-none border-2 border-gray-50 rounded-md
                hover:bg-gray-400 px-2"
                    onClick={(e) => {
                        setVisible(true)
                        Board.canRespond =true ;
                        setModalName(option.componentKey);
                    }}>
                    <button className="appearance-none bg-inherit">
                        {option.title}
                    </button>
                </li>
            })}
        </div>
    </div>)
}