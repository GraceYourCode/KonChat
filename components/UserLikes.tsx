"use client"

import { IPostProps, IReplyProps } from "@/utils/types";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Reply from "./Reply";
import Post from "./Post";

const DemoLikes = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IPostProps[] | IReplyProps[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch (`/api/user/likes/${id}`);
      const data: any = await response.json();

      console.log(data);
      setPosts(data);
    }

    fetchPosts();
  }, [id])

  return (
    <div className="flex flex-col gap-y-4 items-center py-5 md:py-8">
      {
        posts ?
        posts.map(post => {
          if ("postId" in post) return <Reply post={post as IReplyProps} key={post._id.toString()}/>
          else return <Post post={post as IPostProps} key={post._id.toString()}/>
        }):
        <span className="w-10 h-10 rounded-full border-x-red border-y-blue border-solid border-2 my-auto animate-spin"></span>
      }
    </div>
  )
}

const UserLikes = () => {
  return (
    <Suspense>
      <DemoLikes />
    </Suspense>
  )
}

export default UserLikes;
