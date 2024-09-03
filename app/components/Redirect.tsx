"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Redirect(){
    const router  = useRouter();
    const session = useSession();
    if(session?.data?.user){
        router.push("/dashboard");
    }
    return <>
    </>
}