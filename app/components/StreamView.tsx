/* eslint-disable @typescript-eslint/ban-ts-comment */


'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, PlayCircle } from "lucide-react"

//@ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import YouTubePlayer from 'youtube-player';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image"
import axios from 'axios'


const REFRESH_INTERVAL_MS = 10 * 1000;

interface Song {
    id:  string;
    userId: string;
    title: string;
    videoId: string;
    bigImage: string;
    smallImage: string;
    haveUpvoted: boolean;
    played:boolean;
    artist?: string;
    upvotes: number;
    url: string ;
    type: string;
    
  }

export default function StreamView({
    creatorId,
    playVideo
}:{
    creatorId: string;
    playVideo: boolean
}) {
  const [newSongLink, setNewSongLink] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const videoPlayerRef = useRef();
  
  async function refreshStream(){
    
    const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);
    const streams = res.data.streams;
    const activeStream = res.data.activeStream;
    
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatedSongs: Song[] = streams.filter((stream:Song)=> !stream.played).map((stream: any) => ({
      id: stream.id,
      userId: stream.userId,
      url: stream.url,
      title: stream.title,
      videoId: stream.extractedId,
      smallImage: stream.smallImage,
      bigImage: stream.bigImage,
      upvotes: stream.upvoteCount ?? 0,
      haveUpvoted: stream.haveUpvoted ?? false,

  }))
    


    let formattedActiveStream = null;
    if (activeStream && activeStream.stream) {
      formattedActiveStream = {
        id: activeStream.stream.id,
        userId: activeStream.stream.userId,
        url: activeStream.stream.url,
        title: activeStream.stream.title,
        videoId: activeStream.stream.extractedId,
        smallImage: activeStream.stream.smallImage,
        bigImage: activeStream.stream.bigImage,
        upvotes: activeStream.stream.upvoteCount ?? 0,
        played: activeStream.stream.played ?? true,
        haveUpvoted: activeStream.stream.haveUpvoted ?? false,
        type: activeStream.stream.type ?? "default",
      };
    }

  // Set the states
      setSongs(formatedSongs);
      setCurrentSong(formattedActiveStream);

    
    
    

    
  }

  useEffect(() => {
    
    
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const interval = setInterval(() => {
        refreshStream()
    }, REFRESH_INTERVAL_MS);

    
  
    
  }, [])

  useEffect(() => {
        if(!videoPlayerRef.current){
          return;

        }

        const player = YouTubePlayer(videoPlayerRef.current);

        // 'loadVideoById' is queued until the player is ready to receive API calls.
        player.loadVideoById(currentSong?.videoId);

        // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
        player.playVideo();

        player.on('stateChange', (event) => {
          console.log(event.data)
        })
        return () => {
          player.destroy();
        }

        // 'stopVideo' is queued after 'playVideo'.
        
  },[ videoPlayerRef])

  


  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const videoId = extractVideoId(newSongLink)
    if (videoId) {
      try {
       
        const res = await fetch("/api/streams", {
          method: "POST",
          body: JSON.stringify({
            creatorId: creatorId,
            url: newSongLink
          })
        })
        const newSong = await res.json();
        setSongs(prevSongs => [...prevSongs, newSong])
        setNewSongLink('')
        console.log(newSong)
      } catch (error) {
        console.error("Error adding song:", error)
        
      } finally{
        setLoading(false)
      }
    } else {
      
      console.error("Invalid YouTube URL")
      setLoading(false)
    }
  }

  const handleShare = () => {
    const sharableLink = `${window.location.origin}/creator/${creatorId}`
    navigator.clipboard.writeText(sharableLink).then(() => {
      toast("link copied to clipboard", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    })
  }

  const handleVote = (id: string, isUpvote:boolean) => {

    fetch(`/api/streams/${isUpvote ? 'upvotes': 'downvote'}`,{
      method: "POST",
      
      body: JSON.stringify({
        streamId: id
      })
    })
  

    setSongs(songs.map(song => 
      song.id === id ? { ...song, upvotes: isUpvote ? song.upvotes + 1 : song.upvotes } : song
    ).sort((a, b) => b.upvotes - a.upvotes))
  }
    
  const  handlePlayNext = async (id: string) => {
    const songToPlay = songs.find(song => song.id === id)
    if (songToPlay) {
      const data = await fetch('/api/streams/next', {
        method: "GET",
      })
      const json = await data.json();
      const nextStream = json.stream;
      if(nextStream){
        setCurrentSong(nextStream)
      }
      
    
        setCurrentSong(songToPlay)
      
      
      setSongs(prevSongs => prevSongs.filter(song => song.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-purple-100">
      <div className="max-w-full mx-auto lg:flex justify-center items-center gap-4 pt-8">
      <Card className="mt-20 w-[733px] h-[600px]  mb-6 sm:min-w-[512px]  bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-300">Stream Song Voting</CardTitle>
            
          </CardHeader>
          {songs.length === 0 && <p className='text-xl text-center text-purple-400'>NO video in queue</p>}
          <CardContent>
           {playVideo ? <div className="aspect-video mb-4 rounded-lg overflow-hidden" style={{ width: '100%', height: '390px' }}>
            {currentSong?.url && !loading ? (
              <div className='w-full' ref={videoPlayerRef}/>
//      <iframe
//   width="100%"
//   height="380"
//   src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1`}
  
//   allow="autoplay; fullscreen"
//   allowFullScreen
// ></iframe>


    ) : null}
            </div>:  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <iframe
                    
                    src={currentSong?.bigImage}
                    title="YouTube video player"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>}
            <p className="text-center text-lg font-semibold mb-4 text-purple-300">Now Playing: {currentSong?.title} - {currentSong?.artist}</p>
          </CardContent>
        </Card>
      
       
      <div className='flex flex-col '>
      <div className='flex justify-center mb-1' >
      <Button className='border-2 border-gray-600 mb-1' onClick={handleShare}>Share</Button>
      </div>
      <Card className="mb-6 min-w-[750px] bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-300">Submit a YouTube Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter a YouTube link"
                value={newSongLink}
                onChange={(e) => setNewSongLink(e.target.value)}
                className="flex-grow bg-gray-700 border-purple-500 text-purple-100 placeholder-purple-300"
              />
              <Button disabled={loading}  type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                {loading? "Loading": "Add song"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="max-w-[800px] min-h-[400px] bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-300">Upcoming Songs</CardTitle>
            
            
            
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {songs.slice(1).map((song) => (
                <div key={song.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-purple-500">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={song.smallImage}
                        alt={`${song.title} thumbnail`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <p className="text-purple-100 font-semibold">{song.title}</p>
                      <p className="text-purple-300 text-sm">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-purple-300">{song.upvotes}</span>
                    <div className="flex flex-col">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(song.id, true)}
                        aria-label={`Upvote ${song.title}`}
                        className="border-purple-500 text-purple-600 hover:bg-purple-700 hover:text-purple-100"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(song.id, false)}
                        aria-label={`Downvote ${song.title}`}
                        className="border-purple-500 text-purple-600 hover:bg-purple-700 hover:text-purple-100"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    {playVideo ?<Button
                      size="sm"
                      variant="outline"
                      disabled={!playVideo}
                      onClick={() => handlePlayNext(song.id)}
                      aria-label={`Play ${song.title} next`}
                      className="border-purple-500 text-purple-600 hover:bg-purple-700 hover:text-purple-100"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>: null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
        
        

        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          
          theme="dark"
          transition={Bounce}
        />
      </div>
    </div>
  )
}