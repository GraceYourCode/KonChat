"use client"

import { IPostProps, IReplyProps } from "@/utils/types";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Reply from "./Reply";

const DemoReplies = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IReplyProps[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch (`/api/user/replies/${id}`);
      const data: any = await response.json();

      console.log(data);
      setPosts(data);
    }

    fetchPosts();
  }, [id])

  return (
    <div className="flex flex-col gap-y-4 items-center py-5 md:py-8">
      {
        posts && 
        posts.map(post => <Reply post={post} key={post._id.toString()}/>)
      }
    </div>
  )
}

const UserReplies = () => {
  return (
    <Suspense>
      <DemoReplies />
    </Suspense>
  )
}

export default UserReplies;
