import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest){
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

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: user.id
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