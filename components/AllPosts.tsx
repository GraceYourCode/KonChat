"use client"

import { useEffect, useState } from "react"
import Post from "./Post"
import { myContext } from "@/utils/context"
import { IPostProps, IReplyState } from '@/utils/types';
import DeleteModal from './DeleteModal';
import pubnub from '@/utils/pubnub';

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

    const sendPost = (postToSend: any) => {
      setPosts((posts) => {
        // Check if the content is already in the array to prevent duplicates
        if (posts?.some((post) => post._id === postToSend._id)) {
          return posts;
        }
        // If not, add the new content
        return [...posts as IPostProps[], postToSend];
      });
    }

    const updateLikes = (msg: any) => {
      posts?.map(post => {
        if (post._id === msg._id) {
          post.likes = msg.likes;
          return post;
        }
        return post;
      })
    }

    pubnub.subscribe({ channels: ['posts'] });
    pubnub.addListener({
      message: (event) => {
        switch (event.channel) {
          case "posts":
            sendPost(event.message.content)
            break;
          case "likes":
            updateLikes(event.message.content)
          default:
            break;
        }

      }
    });

    return () => {
      pubnub.unsubscribeAll();
    };
  }, [posts])

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
              posts.map((post) => (
                <Post post={post} key={post._id.toString()} />
              ))
            }
          </>
          {showDelete && <DeleteModal />}
        </main>
      </myContext.Provider>
    </div>
  )
}

export default AllPosts
