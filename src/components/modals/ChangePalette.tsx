import { Board } from "@/game/board";
import clsx from "clsx";
import { useCallback, useContext, useState } from "react";
import { GameContext, GameContextType } from "../skeleton";

const colorNames = ['yellow', 'green', 'red', 'blue', 'pink', 'purple', 'teal', 'gray'
    , 'maroon', 'blue-violet', 'brown', 'light green', 'chocolate', 'light blue',
    'dark orange', 'gold'];

const colorNumbers = ['#ffff00', '#ff00', '#ff0000', '#ff', '#ff00ff', '#800080', '#8080', '#808080',
    '#800000', '#8a2be2', '#a52a2a', '#7fff00', '#d2692e', '#6495ed', '#ff8c00', '#ffd700'];


function strToNum(str:string):number{
str = str.substring(1) ;
return Number('0x'+str) ;
}

function findSelected(currentColors : number[]) {
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
    ){
    const {setVisible, setModalName, colors} = useContext(GameContext) ;

    const [selectedColors, setSelectedColors] = useState(()=>findSelected(colors));
    const [selectedCount, setSelectedCount] = useState(4)
    
    return (<div className="flex flex-col bg-white border absolute left-0 top-0 z-10 w-7/10 max-h-full">
        <h2>Choose a different palette</h2>
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
        <button className="transition duration-300 linear hover:bg-pink-500 rounded-full w-6/10 mx-auto bg-pink-300 p-2 disabled:bg-gray-300" 
        disabled={selectedCount < 4} onClick={()=>{
            const nuColors : number[]= [];
            selectedColors.forEach((bool,i)=>{
                if(!bool)
                    return ;
                const num = strToNum(colorNumbers[i]) ;
                nuColors.push(num)
            }) ;

            const json = JSON.stringify(nuColors) ;
            localStorage.setItem('colors',json) ;
            Board.changePalette(nuColors) ;
            setVisible(false) ;
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
    setSelectedColors:(list:boolean[])=>void
    index :number
}

function ColorOption(props: ColorOptionProps) {

    let colorClassName = props.hexCode.substring(1);
    colorClassName = "#" + colorClassName.padStart(6, "0")

    return (<div className="flex items-center h-6 border-box">
        <input type="checkbox" defaultChecked={props.isSelected} className="mx-1"
            onChange={(e) => {
                const isChecked = e.target.checked;
                const maxIsChecked = props.selectedCount === 4;
                if (maxIsChecked && isChecked){
                    e.target.checked = false ;
                    return;
                }
                if(isChecked){
                    props.setSelectedCount(props.selectedCount + 1) ;
                    props.setSelectedColors(bools=>{
                        return bools.map((bool,i)=>{
                            if(i === props.index)
                                return true;
                            return bool;
                        })
                    }) ;
                }
                else{
                    props.setSelectedCount(props.selectedCount - 1) ;
                    props.setSelectedColors(bools=>{
                        return bools.map((b,i)=>{
                            if(i === props.index)
                                return false;
                            return b;
                        })
                    }) ;
                }
            }} />
        <div className="h-9/10 aspect-square mx-1" style={{
            backgroundColor: colorClassName
        }}></div>
        <h5>{props.colorName}</h5>
    </div>);

}