"use client"

import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";



export function AppBar() {

    const session = useSession();
    return <div>
        
        <div className="flex justify-around p-3">
        <Link href="/" className="text-2xl font-bold text-purple-400 flex items-center gap-2">
            <Music className="h-8 w-8" />
            <span>AMUZIC</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link>
            <Link href="#create" className="hover:text-purple-400 transition-colors">Create Room</Link>
            <Link href="#join" className="hover:text-purple-400 transition-colors">Join Room</Link>
          </nav>
            
            
            <div>
            {session.data?.user && <button onClick={() => signOut()} className="hover:text-purple-500">Logout</button>}
               {!session.data?.user && <button className="hover:text-purple-500"  onClick={() => signIn()}> signin                
                    
                </button>}
            </div>

        </div>
    </div>
}