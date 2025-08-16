"use client";

import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { GameContext } from "./skeleton";
import { Board } from "@/game/board";


export default function HowToPlay() {
    return (
        <div className="prose prose-p:my-1 prose-p:mb-[5px] prose-h4:text-2xl prose-figure:my-1 text-black bg-white border rounded-md z-15 h-[95%]
     font-[Georgia] absolute top-1 md:-left-1/6 md:w-[150%] flex flex-col">

            <TopStrip />

            <div className="flex flex-col md:flex-row overflow-y-hidden">

                <div className="md:flex-1 md:h-full">
                    <div className="md:hidden">
                        <Carousel />
                    </div>

                    <div className="hidden md:block">
                        <FigureList />
                    </div>
                </div>



                <div className="md:flex-2 border rounded-md overflow-y-auto">
                    <div className="border-blue-200 border-5 rounded-md px-1">
                        <h2>Welcome to Ran-gi!</h2>

                        <p>Ran-gi is a fun puzzle that's great as a browser game.
                            The puzzle consists of 100 (or 81, or 64 or 49) squares arranged in a grid.
                            The aim of the game is to colour all the white squares according to the rules given below.
                            There are 4 colours on the board. A puzzle can have only one correct solution.</p>

                    </div>

                    <div className="mt-[5px] ">
                        <h4 className="sticky top-0 bg-blue-200 z-20 text-center">Understanding the game</h4>

                        <div className="px-3">
                            <p className="hidden md:block">The images on the left show the same Ran-gi puzzle, before and after being solved:</p>
                            <p className="md:hidden">The images above show the same Ran-gi puzzle, before and after being solved. (Press the arrow
                                icons to switch between the 3 images.)
                            </p>

                            <p>In the solved puzzle, the squares are arranged in strips of one or more squares that are either horizontally or vertically aligned.</p>
                            <p>Look at the area that's circled in the image captioned "Circled puzzle".</p>

                            <ul className="list-inside">
                                <li>The circled part is yellow.</li>
                                <li>3 of the squares are marked 5.</li>
                                <li>The circled squares are 5 in total - corresponding to the 5 noted above.</li>
                                <li>Look keenly at the circled strip and the squares that it neighbours. Notice something?</li>
                                <li>Its neighbours are of different colours, including yellow, but <b><i>there are no yellow squares in
                                    direct contact with the circled strip, i.e the yellow squares around the circled strip do not neighbour it
                                    in any of the main 4 cardinal points.</i></b></li>
                            </ul>

                            <p>Keep these observations in mind. Time to look at the clues now.</p>
                            <p>Look at the unfilled puzzle.</p>
                            <p>There are 4 types of square:</p>
                            <ol>
                                <li>White with no number.</li>
                                <li>Coloured with no number.</li>
                                <li>White with a number.</li>
                                <li>Coloured with a number.</li>
                            </ol>

                        </div>
                    </div>


                    <div className="prose-h5:underline prose-h5:text-xl prose-h5:font-semibold mt-[5px] ">
                        <h4 className="sticky top-0 bg-blue-200 z-20 text-center">The clues of Ran-gi</h4>
                        <ul className="px-3 list-inside list-none">
                            <li>
                                <section className="border-y border-gray-200 my-2">
                                    <h5>Coloured with a number</h5>
                                    <ErsatzTile color="yellow" num={4} />

                                    <p>This clue means that the square is part of a group of 4 squares that are aligned and in
                                        direct contact with each other. Your job is to fill in the others after determining
                                        where this group starts and how it's aligned.</p>
                                    <p>This square has a dot in the bottom-right corner. That means that you can't change its colour since
                                        it has been filled by the algorithm.
                                    </p>

                                    <p><i>Hint :</i>As we saw while studying the diagram, none of the squares that directly neighbour
                                        a strip of a certain colour can be of that same colour. This will help you figure out the alignment
                                        and start and end points of the group you are dealing with.</p>
                                </section>

                            </li>

                            <li>
                                <section className="border-y border-gray-200">
                                    <h5>White with a number</h5>
                                    <ErsatzTile num={5} />
                                    <p>This square is part of a group of five members. As with the last clue, we know the number of
                                        members. But we don't know where it starts or ends, or the alignment, or the colour.</p>
                                    <p>You can fill this type of square. Click on it to change its colour if you think you've
                                        determined it correctly. You can still reset it individually to white or reset the puzzle totally. See "Controls".
                                    </p>
                                    <p><i>Hint :</i> Look in the vicinity of this type of clue. Check which colour, alignment
                                        and position the group can have while still adhering to the cardinal rule of
                                        Ran-gi : <i>The direct neighbour squares of a group can not be of the same colour as the group.</i></p>

                                </section>
                            </li>

                            <li>
                                <section className="border-y border-gray-200">
                                    <h5>Coloured with no number</h5>
                                    <ErsatzTile color="red" />
                                    <p>This square is a member of a group of red squares. How many, though? And where do they start?
                                        Or is it the only member of its group? Figure it out...</p>

                                    <p>This square has been filled by the algorithm. You can't change its colour.</p>
                                    <p><i>Hint :</i> Use elimination to check which combination of colour, alignment and number would
                                        be legal. Don't guess - if there is more than one legal possibility, look elsewhere on
                                        the puzzle until the clues here are unequivocal. </p>

                                </section>
                            </li>

                            <li>
                                <section className="border-y border-gray-200">
                                    <h5>White with no number.</h5>
                                    <ErsatzTile />
                                    <p>This square gives us no information, other than that it's a square in a Ran-gi puzzle...</p>
                                    <p>You can fill this type of square. </p>
                                </section>
                            </li>
                        </ul>
                        {/* {End of description of clues} */}
                    </div>




                    <div className="prose-h5:font-semibold mt-[5px]">
                        <h4 className="sticky top-0 bg-blue-200 z-20 text-center">Controls</h4>
                        <div>
                            <h5 className="text-center">Game management</h5>
                            <div className="px-3">
                                <p>Press <span className="bg-gray-200 rounded-md">Start Again</span> to reset the puzzle to its original state.</p>
                                <p>Press <span className="bg-gray-200 rounded-md">Am I Correct?</span> when you've filled the puzzle. It will
                                    verify your answers and tell you if it's correctly filled.</p>
                                <p>Press the Menu icon &gt; Change palette to change the colour scheme of the puzzle.</p>
                                <p>Press the Menu icon &gt; Change board size to change the number of squares in the puzzle.</p>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-center">Solving the puzzle</h5>
                            <div className="px-3">
                                <p>Every white square can be clicked to change its colour. You will be able to differentiate between
                                    the squares you've filled and those filled by the algorithm by checking if a square has a black dot
                                    at its bottom-right corner - that's a clue filled by the algorithm.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>

    )
}

type ErsatzProps = {
    num?: number;
    color?: string
}
function ErsatzTile(props: ErsatzProps) {
    return <div className={`border w-7 aspect-square flex justify-between`} style={{
        backgroundColor: props.color || "#ffffff"
    }}>
        {<span>{props.num || " "}</span>}
        {props.color && <span className="text-2xl">.</span>}
    </div>
}

function FigureList() {
    const images = [
        <img src="/2x-unsolved.png" alt="Unsolved Ran-gi puzzle" />,
        <img src="/2x-solved.png" alt="Solved Ran-gi puzzle" />,
        <img alt="Image to illustrate rules of Ran-gi" src="/2x-solved-eg.png" />
    ];
    const captions = [
        "Unsolved Ran-gi puzzle",
        "Solved Ran-gi puzzle",
        "Circled puzzle"
    ];

    return <div className="overflow-y-auto h-full">
        {images.map((img, i) => {

            return <figure>
                {img}
                <figcaption>{captions[i]}</figcaption>
            </figure>
        })}
    </div>
}

function Carousel() {
    const captions = [
        "Unsolved Ran-gi puzzle",
        "Solved Ran-gi puzzle",
        "Circled puzzle"
    ];
    const images = [
        <img src="/2x-unsolved.png" alt="Unsolved Ran-gi puzzle" />,
        <img src="/2x-solved.png" alt="Solved Ran-gi puzzle" />,
        <img alt="Image to illustrate rules of Ran-gi" src="/2x-solved-eg.png" />
    ];

    const [dir, setDir] = useState("r");
    const [pos, setPos] = useState(0);
    const tempStyle = "border-gray-200 mx-1 border bg-white appearance-none";
    const anim = dir === "r" ? "animate-slide-in-plus" : "animate-slide-in-minus"

    return <div className="flex justify-between items-center">
        <ScrollButton styling={tempStyle} type="l" setPos={setPos} setDir={setDir} />
        <div className="relative">
            <figure key={pos} className={`${anim}`}>
                {images[pos]}
                <figcaption>{captions[pos]}</figcaption>
            </figure>
        </div>
        <ScrollButton styling={tempStyle} type="r" setPos={setPos} setDir={setDir} />
    </div>


}

type ScrollBtnProps = {
    styling?: string;
    type: "l" | "r",
    setPos: any,
    setDir: any
}

function ScrollButton({ styling, type, setPos, setDir }: ScrollBtnProps) {
    const Icon = type === "r" ? ChevronRightIcon : ChevronLeftIcon;

    function handleClick() {

        if (type === "r") {
            //increases or resets to 0
            setDir("r")
            setPos((pos) => {
                return (pos + 1) % 3;
            });
        }

        else {
            setDir("l")
            setPos((pos) => {
                if (pos === 0)
                    return 2;
                return (pos - 1) % 3;
            })
        }
    }

    return <button className={styling} >
        <Icon className="w-6" onClick={handleClick} />
    </button>
}

function TopStrip() {
    const { setVisible, disableBtns, } = useContext(GameContext);

    function handleClick() {
        setVisible(false);
        Board.canRespond = true;
        disableBtns(false)
    }

    return (
        <div className="flex justify-between">
            <h5>How To Play</h5>
            <button className="hover:border">
                <XMarkIcon className="w-7" onClick={handleClick} />
            </button>
        </div>
    )
}