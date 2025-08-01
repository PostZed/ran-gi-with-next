"use client";

import { Board } from '@/game/board';
import { RangiGame } from '@/game/scene';
import {
    Bars4Icon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { GameContext } from './skeleton';

const url = process.env.NEXT_PUBLIC_URL;

export default function TopButtons() {
    const {setVisible,setModalName} = useContext(GameContext) ;
    async function fetchBoard() {
        try {
            const res = await fetch(`${url}/9/board`);
            if (res.ok) {
                const info = (await res.json()).info;
                Board.dims = 9;
                Board.info = info ;
                Board.createBoard(/*9, info, Board.canvasWidth / 9*/);
            }
            else throw new Error("Game data not fetched");
        } catch (error) {
            console.log(error)
            throw new Error("Game data not fetched");
        }
    }



    return (
        <div className="flex justify-between box-border h-8 pt-1 pb-1 align-items">
            <ColorBar />
            <div className="flex-1">
                <button className='h-full transition duration-300 ease-in-out pl-2 pr-2 border border-black-[1px] rounded-full bg-pink-300
                 hover:bg-pink-500 flex-1 text-center'>How to play</button>
            </div>
            <button onClick={e => {
                setVisible(true);
                setModalName("menu") ;
            }}>
                <Bars4Icon className='w-5 hover:border-1' />
            </button>

        </div>
    );
}

function ColorBar() {
    return (<div className='flex flex-1 h-6 pt-1 pb-1'>
        {Array.from({ length: 4 }).map(i => {
            return <div className='h-full aspect-square bg-[rgb(255,0,0)] mx-1'>

            </div>
        })}
    </div>)
}