"use client"

import { IPostProps, IReplyProps } from "@/utils/types";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Reply from "./Reply";
import Post from "./Post";
import ProfileContentWidget from "./widgets/ProfileContentWidget";
import pubnub from "@/utils/pubnub";

const DemoLikes = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [posts, setPosts] = useState<IPostProps[] | IReplyProps[]>();

  const updateLikes = (msg: IPostProps | IReplyProps) => {
    setPosts(posts => {
      if (!posts) return
      const newPosts = posts?.map(post => {
        if (post?._id.toString() === msg._id.toString()) {
          // Create a new object with the updated property
          return { ...msg };
        }
        return post;
      });
      return newPosts as IPostProps[] | IReplyProps[]
    });
  }

  const editContent = (msg: IPostProps | IReplyProps) => {
    setPosts(posts => {
      if (!posts) return
      const newPosts = posts?.map(post => {
        if (post?._id.toString() === msg._id.toString()) {
          // Create a new object with the updated property
          return { ...msg };
        }
        return post;
      });
      return newPosts as IPostProps[] | IReplyProps[]
    });
  }

  const deletePost = (postToDelete: IPostProps | IReplyProps) => {
    console.log(postToDelete, "yes boss")
    setPosts(posts => {
      if (!posts) return;
      return posts.filter(post => post._id !== postToDelete._id) as IPostProps[] | IReplyProps[];
    })
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/user/likes/${id}`);
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
          posts.map(post => {
            if ("postId" in post) return <Reply post={post as IReplyProps} key={post._id.toString()} />
            else return <Post post={post as IPostProps} key={post._id.toString()} />
          }) :
          <ProfileContentWidget />
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
