import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
import { z } from "zod";

const YT_REG = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const match = data.url.match(YT_REG);
        if (!match) {
            return NextResponse.json({
                message: "Wrong Url format"
            }, { status: 411 });
        }
        const extractedId = match[1];
        const detail = await youtubesearchapi.GetVideoDetails(extractedId);
        const title = detail.title;
        const thumbnail = detail.thumbnail.thumbnails;

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                extractedId,
                url: data.url,
                smallImg: (thumbnail.length > 1 ? thumbnail[thumbnail.length - 2].url : thumbnail[thumbnail.length - 1]) ?? "https://media.istockphoto.com/id/1147544806/vector/no-thumbnail-image-vector-graphic.jpg?s=1024x1024&w=is&k=20&c=RevfxWm_T7B9o7ILk5Bl39hpm9rYm8ZVmoKuXAfD-ew=",
                bigImg: (thumbnail[thumbnail.length - 1].url) ?? "https://media.istockphoto.com/id/1147544806/vector/no-thumbnail-image-vector-graphic.jpg?s=1024x1024&w=is&k=20&c=RevfxWm_T7B9o7ILk5Bl39hpm9rYm8ZVmoKuXAfD-ew=",
                title: title ?? "Cant find video",
                type: "YouTube"
            }
        });

        return NextResponse.json({
            ...data,
            extractedId,
            votes: 0,
            haveUpvoted: false
        }, { status: 200 });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return NextResponse.json({
            message: "Error while adding a stream"
        }, { status: 500 }); // Use 500 for server errors
    }
}

export async function GET(req: NextRequest) {
    try {
        const creatorId = req.nextUrl.searchParams.get("creatorId");
        const session = await getServerSession();

        const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? ""
            }
        });

        if (!user) {
            return NextResponse.json({
                message: "User not authorized"
            }, { status: 401 });
        }

        if (!creatorId) {
            return NextResponse.json({
                message: "Not Valid creatorId"
            }, { status: 400 });
        }

        const [streams, activeStream] = await Promise.all([
            prismaClient.stream.findMany({
                where: {
                    AND: {
                        userId: user.id,
                        played: false
                    }
                },
                include: {
                    _count: {
                        select: {
                            upvotes: true
                        }
                    },
                    upvotes: {
                        where: {
                            userId: user.id
                        }
                    }
                }
            }),
            prismaClient.currentStream.findFirst({
                where: {
                    userId: creatorId,
                },
                include: {
                    stream: true
                }
            })
        ]);

        const sortedStreams = streams
            .map(({ _count, ...rest }) => ({
                ...rest,
                votes: _count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false
            }))
            .sort((a, b) => b.votes - a.votes);

        return NextResponse.json({
            streams: sortedStreams,
            activeStream
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: "Error while fetching streams"
        }, { status: 500 }); 
    }
}
