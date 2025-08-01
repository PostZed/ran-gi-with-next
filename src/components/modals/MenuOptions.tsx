import { useContext } from "react";
import { GameContext, GameContextType } from "../skeleton";
import {
    XMarkIcon
} from '@heroicons/react/24/outline';

type OptionsType = {
    title: string;
    componentKey: string
}

const optionsMap: OptionsType[] = [
    { title: "Change palette", componentKey: "menu" },
    { title: "Change board dimensions", componentKey: "" },
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
   const { setVisible, setModalName } = useContext(GameContext);
    const myName = "menu";

    return (<div className="max-w-7/10 h-fit bg-gray-200 absolute right-0 top-0 border">
        <div className="flex justify-between h-8 items-center">
            <h3 className="border font-serif h-9/10">Menu</h3>
            <button className="appearance-none hover:border" onClick={()=>{
              setVisible(false)
                }
            }>
                <XMarkIcon className="w-7"/>
            </button>
        </div>
        <div>
            {optionsMap.map(option => {
                return <li key={option.title} className="list-style-none border-2 border-gray-400 rounded-md">
                    <button className="appearance-none bg-gray-200" onClick={e => {
                        setVisible(true)
                        setModalName(option.componentKey);
                    }}>
                        {option.title}
                    </button>
                </li>
            })}
        </div>
    </div>)
}