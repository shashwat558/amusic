

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, PlayCircle } from "lucide-react"
import Image from "next/image"

export default function Component() {
  const [newSongLink, setNewSongLink] = useState('')
  const [songs, setSongs] = useState([
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", votes: 5, videoId: "fJ9rUzIMcZQ", imageUrl: "https://img.youtube.com/vi/fJ9rUzIMcZQ/0.jpg" },
    { id: 2, title: "Stairway to Heaven", artist: "Led Zeppelin", votes: 3, videoId: "QkF3oxziUI4", imageUrl: "https://img.youtube.com/vi/QkF3oxziUI4/0.jpg" },
    { id: 3, title: "Hotel California", artist: "Eagles", votes: 2, videoId: "BciS5krYL80", imageUrl: "https://img.youtube.com/vi/BciS5krYL80/0.jpg" },
  ])
  const [currentSong, setCurrentSong] = useState(songs[0])

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
        // In a real application, you would use the YouTube Data API to fetch video details
        // For this example, we'll simulate an API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newSong = {
          id: Date.now(),
          title: `New Song (ID: ${videoId})`, // In reality, this would be fetched from the API
          artist: "Unknown Artist", // This would also be fetched from the API
          votes: 0,
          videoId,
          imageUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`
        }
        setSongs(prevSongs => [...prevSongs, newSong])
        setNewSongLink('')
      } catch (error) {
        console.error("Error adding song:", error)
        // Here you would typically show an error message to the user
      }
    } else {
      // Here you would typically show an error message to the user
      console.error("Invalid YouTube URL")
    }
  }

  const handleVote = (id: number, increment: number) => {
    setSongs(songs.map(song => 
      song.id === id ? { ...song, votes: song.votes + increment } : song
    ).sort((a, b) => b.votes - a.votes))
  }

  const handlePlayNext = (id: number) => {
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
                src={`https://www.youtube.com/embed/${currentSong.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-lg font-semibold mb-4 text-purple-300">Now Playing: {currentSong.title} - {currentSong.artist}</p>
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
                        src={song.imageUrl}
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
                    <span className="text-sm font-semibold text-purple-300">{song.votes}</span>
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