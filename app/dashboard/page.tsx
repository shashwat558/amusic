

'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, PlayCircle } from "lucide-react"
import Image from "next/image"
import axios from 'axios'


const REFRESH_INTERVAL_MS = 10 * 1000;
interface Song {
    id:  string;
    title: string;
    videoId: string;
    bigImage: string;
    smallImage: string;
    haveUpvoted: boolean;
    artist?: string;
    upvotes: number;
    
  }

export default function Component() {
  const [newSongLink, setNewSongLink] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  async function refreshStream(){
    const res = await axios.get("/api/streams/my");
    const streams = res.data.streams;
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatedSongs = streams.map((stream: any) => ({
        id: stream.id,
        title: stream.title,
        videoId: stream.extractedId,
        smallImage: stream.smallImage,
        bigImage: stream.bigImage,
        upvotes: stream.upvoteCount ?? 0,
        haveUpvoted: stream.haveUpvoted ?? false,

    }))
    setSongs(formatedSongs)

    if(!currentSong && formatedSongs.length > 0){
        setCurrentSong(formatedSongs[0])
    }
    console.log(formatedSongs)
    
    

    
  }

  useEffect(() => {
    refreshStream();
    const interval = setInterval(() => {
      refreshStream();  // Refresh stream data every 10 seconds
    }, REFRESH_INTERVAL_MS);
  
    return () => clearInterval(interval);  // Clean up interval on unmount
  }, [currentSong])

  


  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractVideoId(newSongLink)
    if (videoId) {
      try {
       
        await new Promise(resolve => setTimeout(resolve, 1000))

        const existingSong = songs.find(song => song.videoId === videoId);
        console.log(existingSong)
        
        const newSong = {
          id: Date.now().toString(),
          title: `${"title"}`, 
          artist: "Unknown Artist", 
          upvotes: 0,
          videoId,
          smallImage: existingSong ? existingSong.smallImage : `https://img.youtube.com/vi/${videoId}/0.jpg`, // Fallback if not found
          bigImage: existingSong ? existingSong.bigImage : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          haveUpvoted: false
        }
        setSongs(prevSongs => [...prevSongs, newSong])
        setNewSongLink('')
        console.log(newSong)
      } catch (error) {
        console.error("Error adding song:", error)
        // Here you would typically show an error message to the user
      }
    } else {
      // Here you would typically show an error message to the user
      console.error("Invalid YouTube URL")
    }
  }

  const handleVote = (id: string, increment: number) => {

    fetch('/api/streams/upvotes',{
      method: "POST",
      
      body: JSON.stringify({
        streamId: id
      })
    })
  

    setSongs(songs.map(song => 
      song.id === id ? { ...song, upvotes: song.upvotes + increment } : song
    ).sort((a, b) => b.upvotes - a.upvotes))
  }
    
  const handlePlayNext = (id: string) => {
    const songToPlay = songs.find(song => song.id === id)
    if (songToPlay) {
      setCurrentSong(songToPlay)
      setSongs(prevSongs => prevSongs.filter(song => song.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-300">Stream Song Voting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={currentSong?.bigImage}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-lg font-semibold mb-4 text-purple-300">Now Playing: {currentSong?.title} - {currentSong?.artist}</p>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
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
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                Add Song
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-purple-500 border-2 shadow-lg shadow-purple-500/50">
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
                        src={""}
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
                        onClick={() => handleVote(song.id, 1)}
                        aria-label={`Upvote ${song.title}`}
                        className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-purple-100"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(song.id, -1)}
                        aria-label={`Downvote ${song.title}`}
                        className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-purple-100"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlayNext(song.id)}
                      aria-label={`Play ${song.title} next`}
                      className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-purple-100"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}