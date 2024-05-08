"use client"

import dynamic from 'next/dynamic'

const Textbox = dynamic(() => import('@/components/Textbox'), {
  ssr: false,
});

import { useEffect, useState } from "react"
import Post from "./Post"
import { myContext } from "@/utils/context"
import { IPostProps, IReplyState } from '@/utils/types';
import DeleteModal from './DeleteModal';

const AllPosts = () => {
  const [posts, setPosts] = useState<IPostProps[]>();
  const [reply, setReply] = useState<IReplyState | null>(null);
  const [edit, setEdit] = useState<IReplyState | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const popUpDelete = (id: string | null) => {
    setShowDelete(prev => !prev);
    console.log(id)
    setToDelete(id);
  }

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const res = await fetch("/api/posts/all", {
          method: "POST",
          next: { revalidate: 15 },
          cache: "no-store"
        });
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
        <myContext.Provider value={{
          posts, setPosts,
          reply, setReply,
          edit, setEdit,
          toDelete, popUpDelete,
          setShowDelete,
        }}>
      <main className="align-page flex flex-col gap-y-4 items-center py-5 md:py-8">
        <>
          {posts &&
            posts.map((post: any) => (
              <Post post={post} key={post._id}/>
            ))
          }
        </>
        {showDelete && <DeleteModal />}
      </main>
        </myContext.Provider>
      {/* <Textbox /> */}
    </div>
  )
}

export default AllPosts
