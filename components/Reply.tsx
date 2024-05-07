"use client"

import Identifier from "./Identifier";
import Contents from "./Contents";
import LikeButton from "./LikeButton";
import Button from "./Button";
import { IReplyProps, IReplyState } from "@/utils/types";
import { useContext } from "react";
import { myContext } from "@/utils/context";
import Replybox from "./ReplyBox";

const Reply = ({ post }: { post: IReplyProps }) => {
  const { reply, setReply } = useContext(myContext);
  const showReplyBox = () => {
    setReply({
      id: post._id,
      postId: post._id,
      username: post.creator.username,
      show: true,
    })
  }
  return (
    <>

      <div className={`bg-white w-95% p-5 rounded-md flex gap-4 items-start min-h-fit`}>

        {
          // this aside tag below is meant for desktop view and tablet view 
          <aside className="bg-background px-3 rounded-md py-3 hidden sm:block">
            <LikeButton likes={post.likes} desktop={true} />
          </aside>
        }

        <main className="flex flex-col w-full gap-y-3">
          <div className="flex justify-between w-full">
            <Identifier dateCreated="yesterday"
              image={post.creator.image}
              username={post.creator.username} />

            <Button desktop={true} type="Reply" click={showReplyBox} />
          </div>

          <Contents content={post.content} />

          {
            // for sreens with smaller width
            <div className="flex sm:hidden justify-between">
              <aside className="bg-background px-4 rounded-lg py-2">
                <LikeButton likes={post.likes} />
              </aside>

              <Button type="Reply" click={showReplyBox} />
            </div>
          }
        </main>
      </div>
      {
        reply &&
        reply.id === post._id &&
        <Replybox />
      }
    </>
  )
}

export default Reply
