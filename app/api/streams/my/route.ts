import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET ( req:NextRequest ){
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where:{
            email : session?.user?.email ?? ""
        }
    })
    if(!user){
        return NextResponse.json({
            message : "User not authorized"
        }, { status : 401 })
    }
    const streams = await prismaClient.stream.findMany({
        where:{
            userId : user.id
        },
        include:{
            _count:{
                select: {
                    upvotes : true
                }
            },
            upvotes:{
                where: {
                    userId:user.id
                }
            }
        }
    })
    const sortedStreams = streams
        .map(({ _count, ...rest }) => ({
            ...rest,
            votes: _count.upvotes,
            haveUpvoted : rest.upvotes.length ? true : false
        }))
        .sort((a, b) => b.votes - a.votes);
    return NextResponse.json({
        streams : sortedStreams
    },{ status : 200 })
}