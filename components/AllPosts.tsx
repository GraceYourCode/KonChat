"use client"

import dynamic from 'next/dynamic'

const Textbox = dynamic(() => import('@/components/Textbox'), {
  ssr: false,
});

import { useEffect, useState } from "react"
import Post from "./Post"
import { myContext } from "@/utils/context"
import { IPostProps, IReplyState } from '@/utils/types';

const AllPosts = () => {
  const [posts, setPosts] = useState<IPostProps[]>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [reply, setReply] = useState<IReplyState | null>(null);
  console.log(submitting)

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const res = await fetch("/api/posts/all");
        const data = await res.json()
        setPosts(data);
        console.log(data, "come")
      } catch (error: any) {
        console.log(error)
      }
    }
    getAllPosts();
    // date();
  }, [])

  return (
    <div className="flex flex-col items-center w-screen bg-background min-h-screen">
      <main className="align-page flex flex-col gap-y-4 items-center pb-3 md:pb-5">
        <myContext.Provider value={{
          posts, setPosts,
          submitting, setSubmitting,
          reply, setReply
        }}>
        <>
          {posts &&
            posts.map((post: any) => (
              <Post post={post} key={post._id}/>
            ))
          }
        </>
        </myContext.Provider>
      </main>
      <Textbox />
    </div>
  )
}

export default AllPosts
