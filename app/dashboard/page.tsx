

'use client'

import StreamView from '../components/StreamView'



const creatorId = "9f262299-5250-47ad-b1c9-103e1f57a20c";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Song {
    id:  string;
    userId: string;
    title: string;
    videoId: string;
    bigImage: string;
    smallImage: string;
    haveUpvoted: boolean;
    
    artist?: string;
    upvotes: number;
    url: string ;
    type: string;
    
  }

export default function Component() {
  return <StreamView creatorId={creatorId} playVideo={true}/>
}