"use client"

import { signIn, signOut, useSession } from "next-auth/react";



export function AppBar() {

    const session = useSession();
    return <div>
        <div className="flex justify-around p-3">
            <div>AMUZIC</div>
            <div>
            {session.data?.user && <button onClick={() => signOut()}>Logout</button>}
               {!session.data?.user && <button onClick={() => signIn()}> signin                
                    
                </button>}
            </div>

        </div>
    </div>
}