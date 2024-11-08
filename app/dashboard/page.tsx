

'use client'

import StreamView from '../components/StreamView'



const creatorId = "de9304c3-5998-4f41-9881-e504bfd3d3cf";
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