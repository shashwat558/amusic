
import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import youtubesearchapi from "youtube-search-api"
import { getServerSession } from "next-auth";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/

export const CreateStreamSchema = z.object({
    creatorId: z.string(),
    //TODO: Find a way to validat youtube and spotify url
    url: z.string().url() 
})

export async function POST(req: NextRequest){
    
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        if(!isYt){
            return NextResponse.json({
                message: "Wrong URL format"
            },{
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1]

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        console.log(res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1: 1);

        const stream = await prismaClient.stream.create({
           data:{
            userId: data.creatorId,
            url: data.url,
            extractedId,
            type: 'Youtube',
            title: res.title ?? "can't find title",
            bigImage: thumbnails[thumbnails.length - 1].url ?? "",
            smallImage: (thumbnails.length > 1 ? thumbnails[thumbnails.length -2].url: thumbnails[thumbnails.length - 1].url) ?? ""

           }

        })
        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "error while adding a stream",
            error,
            
        },{
            status: 500
        })
        
    }



}



export async function GET(req:NextRequest){
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where:{
            email: session?.user?.email ?? ""
        }
    });

    if(!user) {
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 403
        })
    }
     const creatorId = req.nextUrl.searchParams.get("creatorId");

     if(!creatorId){
        return NextResponse.json({
            message: "Missing Id"
        }, {
            status: 411
        })
     }



     const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
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
    })
    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvoteCount: _count.upvotes,
            haveUpvoted: rest.upvotes.length > 0 ? true : false
        }))
    })
}