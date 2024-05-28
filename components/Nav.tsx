"use client"

import { useSession } from "next-auth/react"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Textbox from "./Textbox";
import logo from '@/public/Images/my-logo.png'
import { MdOutlinePostAdd } from "react-icons/md";
import SignInModal from "./SignIn";


const Navigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [providers, setProviders] = useState<Object | null>(null);
  const navBar = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>();
  const [post, setPost] = useState<boolean>(false);
  const [login, setLogin] = useState(false);

  const togglePost = () => setPost(prev => !prev)

  const sign_In = () => setLogin(prev => !prev);

  useEffect(() => {
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
          <div className="flex justify-between items-center">
            <Image src={logo} alt="logo" width={140} />
            {
              //checks if user is logged in, it displays sign out so the user can sign out
              session?.user ? (
                <div className="flex items-center gap-6">

                  <Image
                    className="rounded-full"
                    width={40}
                    height={40}
                    src={session?.user.image}
                    alt="profile pic"
                    quality={100} />

                  {pathname === "/" &&
                    <>
                      <button className="bg-blue px-8 py-2 text-white rounded-full hidden sm:block text-xs" onClick={togglePost}>Post</button>
                      <button className="bg-blue w-10 h-10  text-white rounded-full sm:hidden items-center flex justify-center" onClick={togglePost}><MdOutlinePostAdd className="text-xl"/></button>
                    </>
                  }
                </div>
              ) : (

                <>
                  {/* {
                    //since user is not logged in, it asks user to log in
                    providers &&
                    Object.values(providers).map((provider) => (
                      <button key={provider.name} className="auth"
                        onClick={() => signIn(provider.id)}>
                        Sign In
                      </button>
                    ))} */}
                    <button className="auth" onClick={() => sign_In()}>Sign In</button>
                </>
              )}
          </div>
        </div>
      </nav>
      <Textbox post={post} close={togglePost} />
      {login && <SignInModal click={sign_In} />}
    </>
  )
}


export default Navigation
