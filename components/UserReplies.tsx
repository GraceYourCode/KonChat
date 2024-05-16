"use client"

import { IPostProps, IReplyProps } from "@/utils/types";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Reply from "./Reply";
import ProfileContentWidget from "./widgets/ProfileContentWidget";
import pubnub from "@/utils/pubnub";

const DemoReplies = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IReplyProps[]>();

  const updateLikes = (msg: IReplyProps) => {
    setPosts(posts => posts?.map(post => {
      if (post._id.toString() === msg._id.toString()) {
        // Create a new object with the updated property
        return { ...post, likes: msg.likes };
      }
      return post;
    }));
  }

  const editContent = (msg: IReplyProps) => {
    console.log(msg)
    setPosts(posts => posts?.map(post => {
      if (post._id.toString() === msg._id.toString()) {
        // Create a new object with the updated property
        return { ...post, content: msg.content };
      }
      return post;
    }));
  }

  const deletePost = (postToDelete: IReplyProps) => {
    console.log(postToDelete, "yes boss")
    setPosts(posts => posts?.filter(post => post._id !== postToDelete._id))
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch (`/api/user/replies/${id}`);
      const data: any = await response.json();

      console.log(data);
      setPosts(data);
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
        posts ?
        posts.map(post => <Reply post={post} key={post._id.toString()}/>):
        <ProfileContentWidget/>
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
