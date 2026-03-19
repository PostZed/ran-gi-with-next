import { useContext, useState } from "react";
import { GameContext } from "../skeleton";
import { XMarkIcon } from "@heroicons/react/24/solid";


export default function ChangeSize() {
    const { dimensions, setDimensions, setGameCount, removeModal } = useContext(GameContext);
    const [selectedDimension, setSelectedDimension] = useState(dimensions)
    return (
        <div className="md:w-7/10 flex flex-col absolute bg-white rounded-md border">
            <div className="flex justify-between">
                <h4 className="m-1">Choose the dimensions of your Ran-gi board:</h4>
                <button className="appearance-none hover:border mx-1" onClick={() => {
                    removeModal();
                    setSelectedDimension(dimensions);
                }
                }>
                    <XMarkIcon className="w-7" />
                </button>
            </div>
            <ul>
                {
                    Array.from({ length: 4 }).map((_, i) => {
                        const num = i + 7;
                        return <li key={`${num}`} className="flex list-none">
                            <input type="radio" id={`${num}`} name="dimensions" defaultChecked={num === dimensions}
                                onChange={(e) => {
                                    if (e.currentTarget.checked)
                                        setSelectedDimension(num);
                                }} />
                            <label className="mx-1" htmlFor={`${num}`}>{`${num} by ${num}`}</label>
                        </li>
                    })
                }
            </ul>

            <button className="flex-none w-7/10 mx-auto pl-2 pr-2 btn" disabled={dimensions === selectedDimension}
                onClick={() => {
                    removeModal();
                    setDimensions(selectedDimension);
                    setGameCount((count: number) => {
                        return count + 1;
                    })
                    localStorage.setItem("dimensions", "" + selectedDimension);
                }}>Save</button>
        </div>
    )
}