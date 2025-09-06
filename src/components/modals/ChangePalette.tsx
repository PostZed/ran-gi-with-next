import { Board } from "@/game/board";
import clsx from "clsx";
import { useCallback, useContext, useState } from "react";
import { GameContext, GameContextType } from "../skeleton";
import { XMarkIcon } from "@heroicons/react/24/outline";

const colorNames = ['yellow', 'green', 'red', 'blue', 'pink', 'purple', 'teal', 'gray'
    , 'maroon', 'blue-violet', 'brown', 'light green', 'chocolate', 'light blue',
    'dark orange', 'gold'];

const colorNumbers = ['#ffff00', '#ff00', '#ff0000', '#ff', '#ff00ff', '#800080', '#8080', '#808080',
    '#800000', '#8a2be2', '#a52a2a', '#7fff00', '#d2692e', '#6495ed', '#ff8c00', '#ffd700'];


function strToNum(str: string): number {
    str = str.substring(1);
    return Number('0x' + str);
}

function decimalToHexString(num: number) {
    let hex = Number(num).toString(16);
    hex = "#" + hex.padStart(6, "0");
    return hex;
}

function findSelected(currentColors: number[]) {
    let bools = Array.from({ length: colorNumbers.length }).map(i => false);
    for (let i = 0; i < colorNumbers.length; i++) {
        let str = colorNumbers[i].substring(1);
        str = "0x" + str.padStart(6, "0");
        let num = Number(str);
        const present = currentColors.findIndex((item, i) => {
            return item === num;
        });
        if (present >= 0) {
            bools[i] = true
        }
    }

    return bools;
}

export default function Palette(
    //     {dimensions,
    //     colors,
    //     setVisible,
    //     setModalName
    // }: GameContextType
) {
    const { setVisible, setColors, colors, disableBtns } = useContext(GameContext);

    const [selectedColors, setSelectedColors] = useState(() => findSelected(colors));
    const [selectedCount, setSelectedCount] = useState(4)

    return (<div className="flex flex-col bg-white border absolute left-0 top-0 z-10 max-w-7/10 max-h-[70%]">
        <div className="flex justify-between border border-gray-300">
            <h2 className="">Choose a different palette</h2>
            <button className="appearance-none hover:border-1 mx-1" onClick={() => {
                Board.canRespond =true;
                setVisible(false);
                disableBtns(false) ;
            }
            }>
                <XMarkIcon className="w-7" />
            </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto">
            {colorNames.map((colorName, i) => (
                <ColorOption hexCode={colorNumbers[i]}
                    key={colorNames[i]}
                    colorName={colorName}
                    isSelected={selectedColors[i]}
                    selectedCount={selectedCount}
                    setSelectedCount={setSelectedCount}
                    setSelectedColors={setSelectedColors}
                    index={i}
                />
            ))}
        </div>
        <button className="w-6/10 mx-auto flex-none px-2 btn"
            disabled={selectedCount < 4} onClick={() => {
                const nuColors: number[] = [];
                selectedColors.forEach((bool, i) => {
                    if (!bool)
                        return;
                    const num = strToNum(colorNumbers[i]);
                    nuColors.push(num)
                });

                const json = JSON.stringify(nuColors);
                localStorage.setItem('colors', json);
                Board.changePalette(nuColors);
                setColors(nuColors)
                Board.canRespond = true;
                setVisible(false);
                disableBtns(false)
            }}>
            Save
        </button>
    </div>)
}



type ColorOptionProps = {
    hexCode: string;
    colorName: string;
    isSelected: boolean,
    selectedCount: number,
    setSelectedCount: (count: number) => void
    setSelectedColors: (list: boolean[]) => void
    index: number
}

function ColorOption(props: ColorOptionProps) {

    let colorClassName = props.hexCode.substring(1);
    colorClassName = "#" + colorClassName.padStart(6, "0")
    return (<div className="flex h-9 items-center md:h-6 border-box">
        <input type="checkbox" defaultChecked={props.isSelected} className="mx-2 md:mx-1"
            onChange={(e) => {
                const isChecked = e.target.checked;
                const maxIsChecked = props.selectedCount === 4;
                if (maxIsChecked && isChecked) {
                    e.target.checked = false;
                    return;
                }
                if (isChecked) {
                    props.setSelectedCount(props.selectedCount + 1);
                    props.setSelectedColors(bools => {
                        return bools.map((bool, i) => {
                            if (i === props.index)
                                return true;
                            return bool;
                        })
                    });
                }
                else {
                    props.setSelectedCount(props.selectedCount - 1);
                    props.setSelectedColors(bools => {
                        return bools.map((b, i) => {
                            if (i === props.index)
                                return false;
                            return b;
                        })
                    });
                }
            }} />
        <div className="h-9/10 aspect-square rounded-xl mx-1" style={{
            backgroundColor: colorClassName
        }}></div>
        <h5>{props.colorName}</h5>
    </div>);

}