"use client"

import BackBtn from '@/components/Back';
import DeleteModal from '@/components/DeleteModal';
import Post from '@/components/Post';
import { myContext } from "@/utils/context"
import pubnub from '@/utils/pubnub';
import { IPostProps, IReplyProps, IReplyState } from '@/utils/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const Page = () => {
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

  const sendReply = (replyToSend: IReplyProps) => {
    setPost(post => {
      // Check if the content is already in the array to prevent duplicates
      if (post?.replies.some((reply) => reply?._id === replyToSend._id)) {
        return post;
      }
      // If not, add the new content
      return { ...post as IPostProps, replies: [...post?.replies as IReplyProps[], replyToSend] };
    });
  }

  const updateLikes = (msg: IPostProps | IReplyProps) => {
    if ("postId" in msg) {
      console.log(msg)
      setPost((post) => {
        if (!post) return
        const newReplies = post.replies.map(reply => {
          if (reply?._id === msg._id) {
            return { ...msg }
          }
          return reply;
        });
        return {...post, replies: newReplies}
      })
    } else {
      setPost(post => {
        if (post?._id.toString() === msg._id.toString()) {
          // Create a new object with the updated property
          return { ...post, likes: msg.likes };
        }
        return post;
      });
    }
  }

  const editContent = (msg: IPostProps | IReplyProps) => {
    if ("postId" in msg) {
      setPost((post) => {
        if (!post) return
        const newReplies = post.replies.map(reply => {
          if (reply?._id === msg._id) {
            return { ...msg }
          }
          return reply;
        });
        return {...post, replies: newReplies}
      })
    } else {
      setPost(post => {
        if (post?._id.toString() === msg._id.toString()) {
          // Create a new object with the updated property
          return { ...post, content: msg.content };
        }
        return post;
      });
    }
  }

  const deletePost = (postToDelete: IPostProps | IReplyProps) => {
    console.log(postToDelete, "yes boss")
    if ("postId" in postToDelete) {
      setPost(post => {
        if (!post) return
        const newReplies = post.replies.filter(reply => reply?._id !== postToDelete._id)
        return {...post, replies: newReplies}
      })
    } else setPost(undefined)
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data)
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchPost();

    pubnub.subscribe({ channels: ['replies', 'likes', 'delete', 'edit'] });
    pubnub.addListener({
      message: (event) => {
        switch (event.channel) {
          case "replies":
            sendReply(event.message.content)
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

const PostPage = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}

export default PostPage
