import { useContext, useEffect, useState } from "react"
import { GameContext } from "../skeleton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Board } from "@/game/board";

type ClickedState = "success" | "unclicked" | "fail";

export default function GameLink() {
    const { setVisible, setModalName, setLink, link, disableBtns } = useContext(GameContext);
    const [clickState, setClickState] = useState<ClickedState>("unclicked");
    let text;
    switch (clickState) {
        case "unclicked":
            text = "Copy Link"
            break;

        case "success":
            text = "Copied!";
            break;

        case "fail":
            text = "Not Copied"
    }
    useEffect(() => {
        let timeout;
        if (clickState === "success") {
            timeout = setTimeout(() => {
                setClickState("unclicked")
            }, 3000);
        }

        return () => {
            clearTimeout(timeout);
        }

    }, [clickState]);


    async function copyText() {
        try {
            await navigator.clipboard.writeText(link);
            setClickState("success");
        }
        catch (e) {
            setClickState("fail");
        }
    }

    return <div key={link} className="overflow-x-hidden absolute top-[30%] left-[10%] w-[80%] ">
        <button className="w-7 border rounded-full bg-gray-100 hover:scale-105" onClick={e => {
            setVisible(false);
            Board.canRespond = true;
            disableBtns(false);
        }}>
            <XMarkIcon className="w-7 h-7" />
        </button>
        <div className="bg-gray-50 border-2 border-gray-300 rounded-md">
            <button className="block border rounded-md h-9 md:h-full md:px-2 px-3 " onClick={copyText}>{text}</button>
            <p className="bg-gray-100 h-9 md:h-full overflow-x-auto rounded-md text-gray-500">{link}</p>
        </div>

    </div>
}