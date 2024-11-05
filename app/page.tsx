import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Users, ThumbsUp, Play } from "lucide-react"
import Link from "next/link"
import { AppBar } from "./components/AppBar"
import { Redirect } from "./components/Redirect"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-2">
      <AppBar />
      <Redirect />
      </div>
      <header className="border-b border-purple-800">
        
      </header>

      <main className="flex-grow">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-300">Stream Music Together</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Create rooms, invite friends, and let everyone vote for the next track. 
              Experience music in a whole new way with MusicStream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 px-8">
                Create a Room
              </Button>
              <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white text-lg py-6 px-8">
                Join a Room
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-purple-300">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Rooms</h3>
                <p className="text-gray-400">Start your own music room and invite friends to join the party.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <ThumbsUp className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Vote for Songs</h3>
                <p className="text-gray-400">Democratize your playlist. Let everyone vote for the next track.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Play className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Streaming</h3>
                <p className="text-gray-400">Enjoy synchronized playback across all devices in the room.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="create" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Create Your Room</h2>
            <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
              <form className="space-y-4">
                <div>
                  <label htmlFor="room-name" className="block mb-2 text-sm font-medium text-gray-300">
                    Room Name
                  </label>
                  <Input 
                    type="text" 
                    id="room-name" 
                    placeholder="Enter room name" 
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="genre" className="block mb-2 text-sm font-medium text-gray-300">
                    Music Genre
                  </label>
                  <Input 
                    type="text" 
                    id="genre" 
                    placeholder="e.g., Rock, Pop, Jazz" 
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Create Room
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section id="join" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-purple-300">Join the Music Revolution</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              Ready to experience music in a whole new way? Sign up now and start creating or joining rooms!
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 px-12">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-purple-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-purple-400 mb-4 md:mb-0">
            © 2023 MusicStream. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact Us</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}