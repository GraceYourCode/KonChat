"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Textbox from "./Textbox";
import logo from '@/public/Images/my-logo.png'
import { MdOutlinePostAdd } from "react-icons/md";
import SignInModal from "./SignIn";
import { PiSignOutBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";


const Navigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [providers, setProviders] = useState<Object | null>(null);
  const navBar = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>();
  const [post, setPost] = useState<boolean>(false);
  const [login, setLogin] = useState(false);
  const [logOut, setLogOut] = useState(false);

  const togglePost = () => setPost(prev => !prev)

  const sign_In = () => setLogin(prev => !prev);

  const sign_Out = () => setLogOut(prev => !prev);

  useEffect(() => {
    if (navBar.current) {
      console.log(navBar.current.clientHeight)
      setHeight(navBar.current?.clientHeight);
    }

  }, [])

  return (
    <>
      <div className="w-screen bg-background" style={{ height: height }}></div>
      <nav className={`fixed bg-background shadow-lg w-screen h-12 xl:h-16 flex items-center justify-center z-50`} ref={navBar}>
        <div className="align-page">
          <div className="flex justify-between items-center">
            <Link href={"/"}>
              <Image src={logo} alt="logo" width={140} />
            </Link>
            {
              //checks if user is logged in, it displays sign out so the user can sign out
              session?.user ? (
                <div className="flex items-center gap-6">

                  <Image
                    className="rounded-full cursor-pointer"
                    width={40}
                    height={40}
                    src={session?.user.image}
                    alt="profile pic"
                    quality={100}
                    onClick={() => sign_Out()} />

                  {pathname === "/" &&
                    <>
                      <button className="bg-blue px-8 py-2 text-white rounded-full hidden sm:block text-xs" onClick={togglePost}>Post</button>
                      <button className="bg-blue w-10 h-10  text-white rounded-full sm:hidden items-center flex justify-center" onClick={togglePost}><MdOutlinePostAdd className="text-xl" /></button>
                    </>
                  }
                </div>
              ) : (

                <>
                  <button className="auth" onClick={() => sign_In()}>Sign In</button>
                </>
              )}
          </div>

        </div>
      </nav>
      {logOut &&
        <div className="w-full fixed top-8 z-50 flex flex-col items-end align-page">

          <div className="bg-white mt-6 text-dark-blue z-50 right-0 w-48 px-5 py-8 rounded-md flex flex-col gap-y-6 shadow-lg">
            <Link href={`/profile?id=${session?.user.id}`} className="flex gap-3 items-center">
              <CgProfile />
              Profile
            </Link>
            <button onClick={() => signOut()} className="flex gap-3 items-center">
              <PiSignOutBold />
              Sign Out
            </button>
          </div>
        </div>
      }
      <Textbox post={post} close={togglePost} />
      {login && <SignInModal click={sign_In} />}
    </>
  )
}


export default Navigation
