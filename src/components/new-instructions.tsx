import { useContext } from "react";
import { GameContext } from "./skeleton"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Board } from "@/game/board";

export function Instructions() {
    const { gameCount, setVisible, disableBtns } = useContext(GameContext);

    function handleClick() {
        setVisible(false);
        Board.canRespond = true;
        disableBtns(false)
    }

    return <div key={gameCount} className="w-[90%] bg-amber-50 absolute left-[5%] top-[5%] h-[90%] border overflow-y-hidden flex flex-col
   prose-headings:font-bold">
        <div className="flex justify-between px-2">
            <h4>How To Play</h4>
            <button className="hover:border" onClick={handleClick}>
                <XMarkIcon className="w-7" />
            </button>
        </div>

        <div className="overflow-y-auto px-3">
          <div className="mb-3 space-y-3">
              <p> The goal of Ran-gi is to colour every white box using the coloured squares and numbers as clues. There are four colours in the puzzle.</p>

            <p>A number, (for example 3) indicates that a square is part of a line of 3 similarly coloured boxes. Lines can only be horizontal or vertical.</p>

            <p>Two strips of squares of the same colour cannot touch each other at any of their edges.</p>
            <p>Look at Figure C for clarification. None of the squares marked "X" is allowed to be yellow. The ticked squares are not 
                in direct contact with the yellow strip. They are allowed to be yellow.
            </p>
            <figure>
                <img src="/figure-c.jpg" alt="Figure illustrating the rules of Ran-gi." />
                <figcaption>Figure C</figcaption>
            </figure>
          </div>


              <div className="px-2 space-y-3">
            <h4>Controls</h4>
            <p>Click on a white box until your desired colour appears.</p>
            <p>Boxes with black dots at the bottom right are the original clues.</p>
            <p>To change the colour palette, click the top right menu.</p>
            <p>The four squares at the top-left show the order of the colours in the current colour palette and change accordingly
                when you change the palette.
            </p>
            <p>Found a particular puzzle interesting? You can get a link to it by clicking the Menu button &gt; Get game link.</p>
        </div>
        </div>


      

    </div>
}



