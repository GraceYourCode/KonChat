"use client"

import { getProviders, signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


const Navigation = () => {
  const {data: session} = useSession();

  const [providers, setProviders] = useState<Object | null>(null);
  const navBar = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const setToProviders = async () => {
      const response = await getProviders();

      setProviders(response)
      console.log(response);

    }

    setToProviders();

    if (navBar.current) {
      console.log(navBar.current.clientHeight)
      setHeight(navBar.current?.clientHeight);
    }

  }, [])

  return (
    <>
    <div className="w-screen bg-background" style={{height: height}}></div>
    <nav className={`fixed bg-background text-right shadow-lg w-screen h-12 flex items-center`} ref={navBar}>
      {/**checks if user is logged in, it displays sign out
       * so the user can sign out
       */}
      {session?.user ? (
        <div className="flex items-center gap-6">
          <Image
          className="rounded-full"
            width={28}
            height={28}
            src={session?.user.image}
            alt="profile pic" />

          <button className="auth" onClick={()=> signOut()}>
            Sign Out
          </button>
        </div>
      ) : (

        <>
          {/** since user is not logged in, 
         * it asks user to log in
         */}
          {providers &&
            Object.values(providers).map((provider) => (
              <button key={provider.name} className="auth"
                onClick={() => signIn(provider.id)}>
                Sign In
              </button>
            ))}
        </>
      )}
    </nav>
    </>
  )
}


export default Navigation
