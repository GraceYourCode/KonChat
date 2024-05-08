"use client"

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const BackBtn = () => {
  const router = useRouter();
  return (
    <>
      {<div className="w-screen h-16"></div>}

    <div className="w-screen flex justify-center fixed bg-background">
    <div className="align-page flex">

    <button className="bg-white px-12 h-10 rounded-md shadow-lg flex items-center gap-4 my-5 text-dark-blue" onClick={()=>router.back()}>
      <IoIosArrowBack/>
      <span>Back</span>
    </button>
    </div>
    </div>
    </>
  )
}

export default BackBtn
