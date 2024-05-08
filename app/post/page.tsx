"use client"

import BackBtn from '@/components/Back';
import DeleteModal from '@/components/DeleteModal';
import Post from '@/components/Post';
import { myContext } from "@/utils/context"
import { IPostProps, IReplyState } from '@/utils/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PostPage = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get("id");
  const [post, setPost] = useState<IPostProps>();
  const [reply, setReply] = useState<IReplyState | null>(null);
  const [edit, setEdit] = useState<IReplyState | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const popUpDelete = (id: string | null) => {
    setShowDelete(prev => !prev);
    setToDelete(id);
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch (`/api/posts/${id}`);
        const data = await response.json();
        setPost(data)
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchPost();
  }, [id])

  return (
    <div className='w-screen flex flex-col items-center min-h-screen'>
      <BackBtn />
      <myContext.Provider value={{
        post, setPost,
        reply, setReply,
        edit, setEdit,
        toDelete, popUpDelete,
        setShowDelete,
      }}>
      <main className="align-page flex flex-col gap-y-4 items-center py-5 md:py-8">
        {
          post && <Post post={post as IPostProps} />
        }
        {showDelete && <DeleteModal />}
        </main>
      </myContext.Provider>
    </div>
  )
}

export default PostPage
