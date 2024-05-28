import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { MdClear } from "react-icons/md"

const SignInModal = ({ click }: { click: () => void }) => {
  return (
    <>
      <div className="fixed w-screen h-screen bg-black opacity-60 top-0 z-50 left-0"></div>
      <div className="fixed w-screen h-screen flex justify-center items-center px-4 xs:p-0 z-50 top-0 left-0">
        <main className="bg-white p-7 opacity-100 flex flex-col gap-5 rounded-md xs:w-96 relative">
          <h4 className="text-dark-blue font-semibold text-xl">Sign In</h4>

          <button className="flex gap-4 rounded-3xl w-full items-center border border-background border-solid justify-center py-3 text-dark-blue xl:hover:bg-black xl:hover:text-white" onClick={() => signIn("google")}>
            <FcGoogle />
            <span>Sign In With Google</span>
          </button>
          <button className="flex gap-4 rounded-3xl w-full items-center bg-background text-black justify-center py-3 xl:hover:bg-black xl:hover:text-white" onClick={() => signIn("github")}>
            <FaGithub />
            <span>Sign In With GitHub</span>
          </button>
          <MdClear className="absolute text-xl right-7 cursor-pointer" onClick={click}/>
        </main>
      </div>
    </>
  )
}

export default SignInModal
