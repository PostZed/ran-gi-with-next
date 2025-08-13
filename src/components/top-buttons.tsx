"use client";

import { Board } from '@/game/board';
import {
    Bars4Icon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { GameContext } from './skeleton';


const url = process.env.NEXT_PUBLIC_URL;

export default function TopButtons({ ref }) {
    const { setVisible, setModalName, disableBtns, btnsDisabled } = useContext(GameContext);


    return (
        <div className="flex justify-between box-border pt-1 pb-1 align-items">
            <ColorBar ref={ref} />
            <div className="flex-1">
                <button className='btn  rounded-full px-3 flex-1 text-center' disabled={btnsDisabled}
                    onClick={(e) => {
                    setModalName("instructions") ;
                    setVisible(true) ;
                    Board.canRespond = false ; 
                    }}>How to play</button>
            </div>
            <button disabled={btnsDisabled} onClick={() => {
                Board.canRespond = false;
                setVisible(true);
                setModalName("menu");
                disableBtns(true);
            }}>
                <Bars4Icon className='md:w-6 w-9 hover:border-1' />
            </button>

        </div>
    );
}

function ColorBar({ ref }) {
    const { colors } = useContext(GameContext);
    return (<div className='flex flex-1 h-6 pt-1 pb-1' ref={ref}>
        {Array.from({ length: 4 }).map((_, i) => {
            const inHex = Number(colors[i]).toString(16);

            return <div key={inHex} className='h-full aspect-square mx-1' style={{
                backgroundColor: "#" + inHex.padStart(6, "0")
            }}>

            </div>
        })}
    </div>)
}