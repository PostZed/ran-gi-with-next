"use client"
//import Skeleton from "@/components/skeleton";

import { SSRPlaceholder } from "@/components/skeletons/SSRPlaceholder"
import dynamic from "next/dynamic"

const Skeleton = dynamic(() => import("@/components/skeleton"), {
  ssr: false,
  loading: () => <SSRPlaceholder />
})

export default function Page() {

  return <Skeleton />
}