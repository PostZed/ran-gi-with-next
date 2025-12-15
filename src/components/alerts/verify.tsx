import { useContext, useEffect, useState } from "react"
import { GameContext } from "../skeleton";
import { Board } from "@/game/board";
import { Progress } from "@radix-ui/react-progress";

export default function Verifying() {
  let [progress, setProgress] = useState(20);
  const { setVisible, btnsDisabled, disableBtns, setModalName, } = useContext(GameContext);
  let [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 5) {
        setVisible(true);
        setModalName("winLossAlert");
        //clearInterval(interval);
      }
      else {
        progress += 20;
        setProgress(progress);
        count += 1;
        setCount(count);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return <div className="bg-white border absolute w-[70%] top-2/5 left-[15%] border-gray-300 p-3">
    <h1 className="text-lg" id="verifying">Checking your board...</h1>
    <div className={`h-1.25 bg-black rounded-full`} style={{
      width: `${(count / 5) * 100}%`
    }}>

    </div>
  </div>
}