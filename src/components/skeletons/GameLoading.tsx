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
    [colors[0], "#969696"],
    [colors[1], "#ababab"],
    [colors[2], "#d1d1d1"],
    [colors[3], "#e8e8e8"]
]);

export function GridSkeleton({ size }: { size: number }) {
    const mySkeleton = list[size - 7].info;

    return <div className={`grid grid-cols-${size}  grid-rows-${size} w-full h-full`}>{
        mySkeleton.map((item,i) => {
            const {col , row} = item 
            let color = map2.get(item.color);
            return <div key={i} className={`animate-glimmer`}
            style={{backgroundColor : color, gridRowStart:row+1, gridColumnStart: col+1}}></div>
        })
    }
    <h1 className="text-2xl absolute top-[48%] p-4">Loading...</h1>
    </div>
}