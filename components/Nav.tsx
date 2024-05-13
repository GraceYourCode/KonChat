"use client"

import { getProviders, signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Textbox from "./Textbox";


const Navigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [providers, setProviders] = useState<Object | null>(null);
  const navBar = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>();
  const [post, setPost] = useState<boolean>(false);

  const togglePost = () => setPost(prev => !prev)

  useEffect(() => {
    const setToProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }

    setToProviders();

    if (navBar.current) {
      console.log(navBar.current.clientHeight)
      setHeight(navBar.current?.clientHeight);
    }

  }, [])

  return (
    <>
      <div className="w-screen bg-background" style={{ height: height }}></div>
      <nav className={`fixed bg-background shadow-lg w-screen h-12 flex items-center justify-center z-50`} ref={navBar}>
        <div className="align-page">

          {/**checks if user is logged in, it displays sign out
       * so the user can sign out
       */}
          {session?.user ? (
            <div className="flex items-center gap-6">

              <Image
                className="rounded-full"
                width={40}
                height={40}
                src={session?.user.image}
                alt="profile pic"
                quality={100}/>

              {pathname === "/" && <button className="bg-blue px-8 py-2 text-white rounded-full hidden sm:block text-xs" onClick={togglePost}>Post</button>}
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
        </div>
      </nav>
      <Textbox post={post} close={togglePost} />
    </>
  )
}


export default Navigation
