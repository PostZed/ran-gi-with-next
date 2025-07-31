"use client";
import Skeleton from "@/components/skeleton";
import type { GameContextType } from "@/components/skeleton";
import dynamic from "next/dynamic";

type Props = {
    params: Promise<{ size: number }>
}

export default function Page(props: Props) {
    // const cookieStore = await cookies();
    // let prefColors = cookieStore?.get('colors')?.value;
    // const dimensions = Number(cookieStore?.get('dimensions')?.value)  || (await props.params).size;
//    const myContext : GameContextType= {
//     dimensions:dimensions, colors:prefColors
//    }

    return <Skeleton  />
}

