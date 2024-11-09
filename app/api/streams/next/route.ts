import { prismaClient } from "@/app/lib/db";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
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
    console.log(user)
    
    console.log("djflsdjfsdlf")
    try {
        const mostUpvotedStream = await prismaClient.stream.findFirst({
            where: {
                userId: user.id
            },
            orderBy: {
                upvotes: {
                    _count: "desc"
                }
            },
            take: 1
        })
        
    
    
     console.log(mostUpvotedStream)
    await Promise.all([prismaClient.currentStream.upsert({
        where: {
            userId: user?.id
        },
        update: {
            streamId: mostUpvotedStream?.id

        },
        create: {
            userId: user.id,
            streamId: mostUpvotedStream?.id
        }
    }),
    prismaClient.stream.delete({
        where: {
            id: mostUpvotedStream?.id ?? ''
        }
        
        
    })
])
return NextResponse.json({
    stream: mostUpvotedStream
})
} catch (error) {
    console.log(error )
    return NextResponse.json({
        message: "Oh shit",
        error
    },{
        status: 411
    })
    
}
}
