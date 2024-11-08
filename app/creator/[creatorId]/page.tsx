import StreamView from "@/app/components/StreamView"

export default function create(
    {
        params: {creatorId}
    }: {params:{
        creatorId: string
    }}
){
    return <StreamView creatorId={creatorId} playVideo={false}/>
}