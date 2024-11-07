

'use client'

import StreamView from '../components/StreamView'



const creatorId = "b3af1ac0-53ce-45d1-bbbf-0f2b4cd1f580";
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
  return <StreamView creatorId={creatorId}/>
}