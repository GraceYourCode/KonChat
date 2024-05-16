"use client"

import { IPostProps, IReplyProps } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Post from "./Post";
import pubnub from "@/utils/pubnub";
import ProfileContentWidget from "./widgets/ProfileContentWidget";
import error from '@/public/Images/network-error.png'
import Image from "next/image";

const DemoPosts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IPostProps[]>();
  const [failed, setFailed] = useState<boolean>(false);

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
    const fetchPosts = async () => {
      const response = await fetch (`/api/user/posts/${id}`);
      const data: any = await response.json();

      if (!response.ok) setFailed(true);
      else {
        if (typeof data === "string") setFailed(true);
        else setPosts(data);
      }
    }

    fetchPosts();

    pubnub.subscribe({ channels: ['likes', 'delete', 'edit'] });
    pubnub.addListener({
      message: (event) => {
        switch (event.channel) {
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
  }, [id])

  return (
    <div className="flex flex-col gap-y-4 items-center py-5 md:py-8">
      {
        failed ?

        //if failed is true then it will display the div below
        <div className="flex flex-col items-center">
          <Image src={error} alt="network error" className="w-56"/>
          <button className="text-white bg-blue px-6 py-2 rounded-md" onClick={() => router.refresh()}>Refresh</button>
        </div> :
        posts ?
        posts.map(post => <Post post={post} key={post._id.toString()}/>) :
        <ProfileContentWidget/>
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
