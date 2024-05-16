"use client"

import { useEffect, useState } from "react"
import Post from "./Post"
import { myContext } from "@/utils/context"
import { IPostProps, IReplyProps, IReplyState } from '@/utils/types';
import DeleteModal from './DeleteModal';
import pubnub from '@/utils/pubnub';
import Image from "next/image";
import error from '@/public/Images/network-error.png'
import { useRouter } from "next/navigation";
import AllPostsWidget from "./widgets/AllPostsWidget";

const AllPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<IPostProps[]>();
  const [reply, setReply] = useState<IReplyState | null>(null);
  const [edit, setEdit] = useState<IReplyState | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const popUpDelete = (id: string | null) => {
    setShowDelete(prev => !prev);
    console.log(id)
    setToDelete(id);
  }

  const sendPost = (postToSend: IPostProps) => {
    setPosts((posts) => {
      // Check if the content is already in the array to prevent duplicates
      if (posts?.some((post) => post._id === postToSend._id)) {
        return posts;
      }
      // If not, add the new content
      return [...posts as IPostProps[], postToSend];
    });
  }

  const updateLikes = (msg: IPostProps) => {
    setPosts(posts => posts?.map(post => {
      if (post._id.toString() === msg._id.toString()) {
        // Create a new object with the updated property
        return { ...post, likes: msg.likes };
      }
      return post;
    }));
  }

  const editContent = (msg: IPostProps) => {
    console.log(msg)
    setPosts(posts => posts?.map(post => {
      if (post._id.toString() === msg._id.toString()) {
        // Create a new object with the updated property
        return { ...post, content: msg.content };
      }
      return post;
    }));
  }

  const deletePost = (postToDelete: IPostProps) => {
    console.log(postToDelete, "yes boss")
    setPosts(posts => posts?.filter(post => post._id !== postToDelete._id))
  }

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch("/api/posts/all", {
          method: "POST",
          next: { revalidate: 15 },
          cache: "no-store"
        });

        if (!response.ok) setFailed(true);
        else {
          try {
            const data = await response.json();
            console.log(typeof data)
            if (typeof data === "string") setFailed(true)
            else {
              setPosts(data);
              console.log(data, "come")
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error: any) {
        console.log(error)
      }
    }
    getAllPosts();

    pubnub.subscribe({ channels: ['posts', 'likes', 'delete', 'edit'] });
    pubnub.addListener({
      message: (event) => {
        switch (event.channel) {
          case "posts":
            sendPost(event.message.content)
            break;
          case "likes":
            updateLikes(event.message.content);
            break;
          case "delete":
            deletePost(event.message.content);
            break;
          case "edit":
            editContent(event.message.content);
            break;
          default:
            break;
        }
      }
    });

    return () => {
      pubnub.unsubscribeAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center w-screen bg-background min-h-screen">
      <myContext.Provider value={{
        reply, setReply,
        edit, setEdit,
        toDelete, popUpDelete,
        setShowDelete,
      }}>
        <main className="align-page flex flex-col gap-y-4 items-center py-5 md:py-8">
          <>
            {
              failed ?

                //if failed is true then it will display the div below
                <div className="flex flex-col items-center">
                  <Image src={error} alt="network error" className="w-56"/>
                  <button className="text-white bg-blue px-6 py-2 rounded-md" onClick={() => router.refresh()}>Refresh</button>
                </div> :

                //contents to load after successfully getting the data from the api
                posts ?
                  posts.map((post) => (
                    <Post post={post} key={post._id.toString()} />
                  )) :

                  // displays while awaiting content from api
                  // <span className="w-10 h-10 rounded-full border-x-red border-y-blue border-solid border-2 my-auto animate-spin top-1/2 fixed"></span>
            <AllPostsWidget/>
            }
          </>
          {showDelete && <DeleteModal />}
        </main>
      </myContext.Provider>
    </div>
  )
}

export default AllPosts
