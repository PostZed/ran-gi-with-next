
import Skeleton from "@/components/skeleton";
import type { GameContextType } from "@/components/skeleton";
import dynamic from "next/dynamic";

type Props = {
    params: Promise<{ size: number }>
}

export default function Page(props: Props) {
  
    return <Skeleton  />
}

