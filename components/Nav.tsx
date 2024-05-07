"use client"

import { onScrollForNavigationBar } from "@/utils/functions";
import { Session } from "next-auth";
import { getProviders, signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { useEffect, useState } from "react";


const Navigation = () => {
  const {data: session} = useSession();

  const [providers, setProviders] = useState<Object | null>(null);
  const [fixed, setFixed] = useState(false)

  useEffect(() => {
    const setToProviders = async () => {
      const response = await getProviders();

      setProviders(response)
      console.log(response);

    }

    setToProviders();

    if (typeof window !== 'undefined') {
      // Code that uses window (only runs in the browser)

      window.addEventListener('scroll', () => onScrollForNavigationBar(setFixed, fixed));

      return () => {
        window.removeEventListener("scroll", () => onScrollForNavigationBar(setFixed, fixed));
      }

    }

  }, [fixed])

  return (
    <nav className={`${fixed && "fixed"} bg-background text-right align-page py-3`}>
      {/**checks if user is logged in, it displays sign out
       * so the user can sign out
       */}
      {session?.user ? (
        <div className="flex items-center gap-6">
          <Image
          className="rounded-full"
            width={28}
            height={28}
            src={session?.user?.image}
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
  )
}


export default Navigation
