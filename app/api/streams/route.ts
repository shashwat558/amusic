import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { z } from 'zod';

const YT_REGEX = new RegExp("^https:\/\/www\.youtube\.com\/watch\?v=[\w=]{11}$")

export const CreateStreamSchema = z.object({
    creatorId: z.string(),
    //TODO: Find a way to validat youtube and spotify url
    url: z.string().url() 
})

export async function POST(req: NextRequest){
    
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt){
            return NextResponse.json({
                message: "Wrong URL format"
            },{
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1]

        prismaClient.stream.create({
           data:{
            userId: data.creatorId,
            url: data.url,
            extractedId,
            type: 'Youtube'
           }

        })

        
    } catch (error) {
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