import Skeleton from "@/components/skeleton";

type Props = {
    params: Promise<{ size:string, puzzleId:string }>
}

export default async function Page(props : Props){
let {size : s, puzzleId} = await props.params ;
const size = Number(s) ;


return <Skeleton size={size} id={puzzleId}/>
}