"use client"

import Identifier from "./Identifier";
import Contents from "./Contents";
import LikeButton from "./LikeButton";
import Button from "./Button";
import { IReplyProps, IReplyState } from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import { myContext } from "@/utils/context";
import Replybox from "./ReplyBox";
import { getTimeDifference } from "@/utils/functions";
import EditBox from "./EditBox";
import { useSession } from "next-auth/react";

const Reply = ({ post }: { post: IReplyProps }) => {
  const { data: session } = useSession();
  const { reply, setReply } = useContext(myContext);
  const { edit, setEdit } = useContext(myContext);
  const { popUpDelete } = useContext(myContext);
  const [dateCreated, setDateCreated] = useState<string>("");

  useEffect(() => {
    const getDateCreated = async () => {
      const date = await getTimeDifference(post.dateCreated);
      setDateCreated(date)
    }
    getDateCreated();
  }, [post.dateCreated])

  const showReplyBox = () => {
    setReply({
      id: post._id,
      postId: post._id,
      username: post.creator.username,
      show: true,
    })
  }

  const showEditBox = () => {
    setEdit({
      id: post._id,
      show: true,
    })
  }

  return (
    <>
      {
        edit !== null &&
        edit.id === post._id && <EditBox contentToEdit={post.content} id={post._id.toString()} />
      }

      <div className={`${edit === null ? "flex" : edit.id === post._id ? "hidden" : "flex"} bg-white w-95% p-5 rounded-md gap-4 items-start min-h-fit`}>
        {
          // this aside tag below is meant for desktop view and tablet view 
          <aside className="bg-background px-3 rounded-md py-3 hidden sm:block">
            <LikeButton likes={post.likes}
              id={post._id.toString()}
              desktop={true}
              usersThatLiked={post.usersThatLiked} />
          </aside>
        }

        <main className="flex flex-col w-full gap-y-3">
          <div className="flex justify-between w-full">
            <Identifier dateCreated={dateCreated}
              image={post.creator.image}
              username={post.creator.username} />

            {session?.user &&
              (session?.user.name.replace(" ", "").toLocaleLowerCase() === post.creator.username ? (
                <div className="flex gap-3 items-center">
                  <Button desktop={true} type="Delete" click={()=>popUpDelete(post._id.toString())}/>
                  <Button desktop={true} type="Edit" click={showEditBox} />
                </div>
              ) :
                <Button desktop={true} click={showReplyBox} type="Reply" />)
            }
          </div>

          <Contents content={post.content} />

          {
            // for sreens with smaller width
            <div className="flex sm:hidden justify-between">
              <aside className="bg-background px-4 rounded-lg py-2">
                <LikeButton likes={post.likes}
                  id={post._id.toString()}
                  usersThatLiked={post.usersThatLiked} />
              </aside>

              {session?.user &&
                (session?.user.name.replace(" ", "").toLocaleLowerCase() === post.creator.username ? (
                  <div className="flex gap-3 items-center">
                    <Button type="Delete" click={()=>popUpDelete(post._id.toString())} />
                    <Button type="Edit" click={showEditBox} />
                  </div>
                ) :
                  <Button click={showReplyBox} type="Reply" />)
              }
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
