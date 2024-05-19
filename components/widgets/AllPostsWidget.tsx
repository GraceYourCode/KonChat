import PostWidget from "./PostWidget"
import Image from "next/image"
import image from "@/public/Images/Untitled-2.png"

const AllPostsWidget = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center py-5 md:py-8 animate-pulse">
      <PostWidget/>
      <PostWidget/>
      <PostWidget/>
    </div>
  )
}

export default AllPostsWidget
