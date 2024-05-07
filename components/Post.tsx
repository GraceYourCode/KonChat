"use client"

import { useSession } from "next-auth/react"
import Button from "./Button"
import Contents from "./Contents"
import Identifier from "./Identifier"
import LikeButton from "./LikeButton"
import Reply from "./Reply"
import { IPostProps, IReplyProps } from "@/utils/types"
import { useContext, useEffect, useState } from "react"
import { myContext } from "@/utils/context"
import Replybox from "./ReplyBox"
import { getTimeDifference } from "@/utils/functions"

const Post = ({ post }: { post: IPostProps }) => {
  const { data: session } = useSession();
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
    <div className="flex flex-col items-end w-full gap-4">
      <div className="bg-white p-5 rounded-md gap-4 items-start w-full min-h-fit flex">

        {
          // this aside tag below is meant for desktop view and tablet view 
          <aside className="bg-background px-3 rounded-md py-3 hidden sm:block">
            <LikeButton desktop={true} likes={post.likes} />
          </aside>
        }

        <main className="flex flex-col w-full gap-y-3">
          <div className="flex justify-between w-full">
            <Identifier dateCreated={"tea"}
              image={post.creator.image}
              username={post.creator.username} />

            {/* {session?.user &&
              (session?.user.name.replace(" ", "").toLocaleLowerCase() === username ? (
                <div className="flex gap-3 items-center">
                  <Button />
                  <Button />
                </div>
              ) :
                <Button />)
            } */}

            <Button desktop={true} type="Reply" click={showReplyBox} />
          </div>

          <Contents content={post.content} />

          {
            // for sreens with smaller width
            <div className="flex sm:hidden justify-between">
              <aside className="bg-background px-4 rounded-lg py-2">
                <LikeButton likes={post.likes} />
              </aside>

              <Button type="Reply" click={showReplyBox}/>
            </div>
          }
        </main>
      </div>
      <div className="w-full flex flex-col items-end lg:w-95% xl:-11/12 border-0 border-l-2 border-solid border-l-light-gray gap-y-4">
      {
          reply &&
          reply.id === post._id &&
          <Replybox/>
        }
        {
          post.replies.map((reply) => (<Reply post={reply as IReplyProps} key={reply?._id.toString()} />))
        }
      </div>
    </div>
  )
}

export default Post
