export default function HowToPlay() {
    return (
        <div className="prose prose-p:my-1 prose-p:mb-[5px] relative">

            <div className="border-blue-200 border-5 rounded-md px-1">
                <h3>Welcome to Ran-gi!</h3>

                <p>Ran-gi is a fun puzzle game that's ideal as a browser game.
                    The puzzle consists of 100 (or 81, or 64 or 49) squares arranged in a grid.
                    The aim of the game is to colour all the white squares according to the rules given below.
                    There are 4 colours on the board. A puzzle can have only one correct solution.</p>

            </div>

            <div className="border-pink-300 border-5 rounded-md mt-[5px] px-1">
                <h4>How To Play</h4>

                <p>The images below show a Ran-gi board, before and after completion:</p>

                {/* <img className="mx-auto border-2" srcSet="/1x-unsolved.png 180w, /2x-unsolved.png 270w, /3x-unsolved.png 360w, /4x-unsolved.png 545w"
                    sizes="(min-width > 1536px ) 545px, (min-width >= 1280px) 360px, (min-width >= 768px) 270px, 180px"
                />

                <img srcSet="/1x-solved.png 180w, /2x-solved.png 270w, /3x-solved.png 360w, /4x-solved.png 545w"
                    sizes="(min-width > 1536px ) 545px, (min-width >= 1280px) 360px, (min-width >= 768px) 270px, 180px"
                /> */}

               <div className="absolute top-0 left-0 flex">
                <img className="" srcSet="/1x-unsolved.png 180w, /2x-unsolved.png 270w, /3x-unsolved.png 360w, /4x-unsolved.png 545w"
                    sizes="(min-width > 1536px ) 545px, (min-width >= 1280px) 360px, (min-width >= 768px) 270px, 180px"
                />

                <img srcSet="/1x-solved.png 180w, /2x-solved.png 270w, /3x-solved.png 360w, /4x-solved.png 545w"
                    sizes="(min-width > 1536px ) 545px, (min-width >= 1280px) 360px, (min-width >= 768px) 270px, 180px" />
               </div>

                <p>The squares are arranged in strips of one or more squares that are either horizontally or vertically aligned.</p>
                <p>Look at the area that's circled in this image of the solved puzzle.</p>

                <img alt="Image to illustrate rules of Ran-gi" src="/2x-solved-eg.png" />

                <ul className="px-1">
                    <li>The circled part is yellow.</li>
                    <li>3 of the squares are marked 5.</li>
                    <li>The circled squares are 5 in total - corresponding to the 5 noted above.</li>
                    <li>Look keenly at the circled strip and the squares that it neighbours. Notice something?</li>
                    <li>Its neighbours are of different colours, including yellow, but <b><i>there are no yellow squares in
                        direct contact with the circled strip, i.e the yellow squares around the circled strip do not neighbour it
                        in any of the main 4 cardinal points.</i></b></li>
                </ul>

                <h4>From these observations we can now look at the rules and clues of the Ran-gi puzzle.</h4>
                <p>Look at the unfilled puzzle.</p>
                <p>There are 4 types of square:</p>
                <ol>
                    <li>White with no number.</li>
                    <li>Coloured with no number.</li>
                    <li>White with a number.</li>
                    <li>Coloured with a number.</li>
                </ol>

                <p>Each represents a type of clue.</p>
            </div>


            <div>
                <ul>
                    <li>
                        <section>
                            <h5>Coloured with a number</h5>
                            <ErsatzTile color="yellow" num={4} />

                            <p>This clue means that the square is part of a group of 4 squares that are aligned and in
                                direct contact with each other. Your job is to fill in the others after determining
                                where this group starts and how it's aligned.
                                <p>This square has a dot in the bottom-right corner. That means that you can't change its colour since
                                    it has been filled by the algorithm.
                                </p>
                            </p>
                            <p><i>Hint :</i>As we saw while studying the diagram, none of the squares that directly neighbour
                                a strip of a certain colour can be of that same colour. This will help you figure out the alignment
                                and start and end points of the group you are dealing with.</p>
                        </section>
                    </li>

                    <li>
                        <section>
                            <h5>White with a number</h5>
                            <ErsatzTile num={5} />
                            <p>This square is part of a group of five members. As with the last clue, we know the number of
                                members. But we don't know where it starts or ends, or the alignment, or the colour.
                                <p>You can fill this type of square. Click on it to change its colour if you think you've
                                    determined it correctly. You can still reset it individually to white or reset the puzzle totally. See "Controls".
                                </p>
                                <p><i>Hint :</i>Look in the vicinity of this type of clue. Check which colour, alignment
                                    and position the group can have while still adhering to the <b>cardinal</b> rule of
                                    Ran-gi : <i>The direct neighbour squares of a group can not be of the same colour as the group.</i></p>
                            </p>
                        </section>
                    </li>

                    <li>
                        <section>
                            <h5>Coloured with no number</h5>
                            <ErsatzTile color="red" />
                            <p>This square is a member of a group of red squares. How many, though? And where do they start?
                                Or is it the only member of its group? Figure it out...

                                <p>This square has been filled by the algorithm. You can't change its colour.</p>
                                <p><i>Hint :</i> Use elimination to check which combination of colour, alignment and number would
                                    be legal. Don't guess - if there is more than one legal possibility, look elsewhere on
                                    the puzzle until the clues here are unequivocal. </p>
                            </p>
                        </section>
                    </li>

                    <li>
                        <section>
                            <h5>White with no number.</h5>
                            <ErsatzTile />
                            <p>This square gives us no information, other than that it's a square in a Ran-gi puzzle...</p>
                            <p>You can fill this type of square. </p>
                        </section>
                    </li>
                </ul>
                {/* {End of description of clues} */}
            </div>


            <div>
                <h4>Controls</h4>
                <div>
                    <h5>Game management</h5>
                    <p>Press <span className="">Start Again</span> to reset the puzzle to its original state.</p>
                    <p>Press <span className="highlight">Am I Correct?</span> when you've filled the puzzle. It will
                        verify your answers and tell you if it's correctly filled.</p>
                    <p>Press the Menu icon &gt; Change palette to change the colour scheme of the puzzle.</p>
                    <p>Press the Menu icon &gt; Change board size to change the number of squares in the puzzle.</p>
                </div>

                <div>
                    <h5>Solving the puzzle</h5>
                    <p>Every white square can be clicked to change its colour. You will be able to differentiate between
                        the squares you've filled and those filled by the algorithm by ckecking if a square has a black dot
                        at its bottom-right corner - that's a clue filled by the algorithm.
                    </p>
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
