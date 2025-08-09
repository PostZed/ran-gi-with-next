"use client";

import { Board } from '@/game/board';
import { RangiGame } from '@/game/scene';
import {
    Bars4Icon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { GameContext } from './skeleton';
import { fetchGame } from '@/utils/fetchGame';

const url = process.env.NEXT_PUBLIC_URL;

export default function TopButtons({ref}) {
    const { setVisible, setModalName, disableBtns, btnsDisabled } = useContext(GameContext);

  
    return (
        <div className="flex justify-between box-border h-8 pt-1 pb-1 align-items">
            <ColorBar ref={ref}/>
            <div className="flex-1">
                <button className='btn h-full pl-2 rounded-full pr-2 flex-1 text-center' disabled={btnsDisabled}>How to play</button>
            </div>
            <button disabled={btnsDisabled} onClick={() => {
                Board.canRespond = false ;
                setVisible(true);
                setModalName("menu");
                disableBtns(true) ;
            }}>
                <Bars4Icon className='w-5 hover:border-1' />
            </button>

        </div>
    );
}

function ColorBar({ref}) {
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