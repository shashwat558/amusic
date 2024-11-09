

'use client'

import StreamView from '../components/StreamView'



const creatorId = "677df8cb-28c8-42a6-90f2-527baef5f319";
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