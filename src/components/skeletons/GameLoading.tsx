import { colors } from "@/lib/constants";
import { list } from "../../../public/skeletonmain";

export default function GameLoading() {
    return (<div className="">
        <h2 className="text-transparent animate-change-color bg-clip-text
        text-[5rem]
        ">Game Loading...</h2>
    </div>)
}

const colorMap = new Map<number, string>([
    [colors[0], "gray-200"],
    [colors[1], "gray-400"],
    [colors[2], "gray-600"],
    [colors[3], "gray-800"]
]);
const map2 = new Map<number, string>([
    [colors[0], "#ff0"],
    [colors[1], "#ff00"],
    [colors[2], "#ff0000"],
    [colors[3], "#ff"]
]);

export function GridSkeleton({ size }: { size: number }) {
    const mySkeleton = list[size - 7].info;

    return <div className={`grid grid-cols-${size} grid-rows-{size} w-full h-full`}>{
        mySkeleton.map((item) => {
            const {col , row} = item 
            let color = colorMap.get(item.color);
            return <div className={`row-start-${row+1} col-start-${col+1} bg-${color} animate-glimmer`}></div>
        })
    }
    </div>
}