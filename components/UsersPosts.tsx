"use client"

import { IPostProps } from "@/utils/types";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Post from "./Post";

const DemoPosts = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IPostProps[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch (`/api/user/posts/${id}`);
      const data: any = await response.json();

      console.log(data);
      setPosts(data);
    }

    fetchPosts();
  }, [])

  return (
    <div className="flex flex-col gap-y-4 items-center py-5 md:py-8">
      {
        posts && 
        posts.map(post => <Post post={post}/>)
      }
    </div>
  )
}

const UsersPosts = () => {
  return (
    <Suspense>
      <DemoPosts />
    </Suspense>
  )
}

export default UsersPosts;
