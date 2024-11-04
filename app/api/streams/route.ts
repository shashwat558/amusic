/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import youtubesearchapi from "youtube-search-api"

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

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
            message: "Added stream",
            id: stream.id
        })

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "error while adding a stream",
            error
        })
        
    }



}



export async function GET(req:NextRequest){
     const creatorId = req.nextUrl.searchParams.get("creatorId");
     const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
     })

     return NextResponse.json({
        streams
     })
}