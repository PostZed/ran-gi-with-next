"use client" ;
//import Skeleton from "@/components/skeleton";
import dynamic from "next/dynamic";

const Skeleton = dynamic(
  () => import("@/components/skeleton"),
  { ssr: false }
)

export default function Page() {
  
    return <Skeleton  />
}