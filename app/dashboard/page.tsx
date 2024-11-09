

'use client'

import StreamView from '../components/StreamView'



const creatorId = "75725c2e-a583-4b52-8a16-94d61e9d95b0";
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