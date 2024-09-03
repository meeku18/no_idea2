"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react"
import React from "react";

export const AppBar = () => {
    const session = useSession();
    return <div className="flex justify-between px-6 py-4">
        <div className="text-white font-bold text-lg flex flex-col justify-center">
            MUSIZZ
        </div>
        <div className="p-2">
            {session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={()=> signOut()}>LogOut</Button>}
            {!session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700"  onClick={()=> signIn()}>SignIn</Button>}
        </div>
    </div>
}   