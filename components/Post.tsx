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
import { FiMessageCircle } from "react-icons/fi";
import EditBox from "./EditBox"
import { usePathname, useRouter } from "next/navigation"

const Post = ({ post }: { post: IPostProps }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
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
    <div className={`flex flex-col items-end w-full gap-4`} onClick={() => pathname !== "/post" && router.push(`/post?id=${post._id}`)}>
      {
        edit !== null &&
        edit.id === post._id && <EditBox contentToEdit={post.content} id={post._id.toString()} />
      }

      <div className={`${edit === null ? "flex" : edit.id === post._id ? "hidden" : "flex"} ${pathname !== "/post" && "cursor-pointer hover:shadow-md"} bg-white p-5 rounded-md gap-4 items-start w-full min-h-fit`}>
        <main className="flex flex-col w-full gap-y-3">
          <div className="flex justify-between w-full">
            <Identifier dateCreated={dateCreated}
              image={post.creator.image} id={post.creator._id.toString()}
              username={post.creator.username} />

            {session?.user &&
              (session?.user.name.replace(" ", "").toLocaleLowerCase() === post.creator.username ? (
                <div className="flex gap-3 items-center">
                  <Button desktop={true} type="Delete" click={() => popUpDelete(post._id.toString())} />
                  <Button desktop={true} type="Edit" click={showEditBox} />
                </div>
              ) :
                <Button desktop={true} click={showReplyBox} type="Reply" />)
            }

          </div>

          <Contents content={post.content} />

          {
            // for sreens with smaller width
            <div className="flex justify-between items-center">
              <aside className="flex items-center gap-5">
                <LikeButton likes={post.likes}
                  id={post._id.toString()}
                  usersThatLiked={post.usersThatLiked} />

                <div className="font-medium text-blue flex items-center cursor-pointer xl:w-10 xl:h-10 xl:hover:bg-gray-blue justify-center rounded-full">
                  <FiMessageCircle className="text-lg" />
                  <small className="">{post.replies.length}</small>
                </div>
              </aside>

<div className="sm:hidden">
              {session?.user &&
                (session?.user.name.replace(" ", "").toLocaleLowerCase() === post.creator.username ? (
                  <div className="flex gap-3 items-center">
                    <Button type="Delete" click={() => popUpDelete(post._id.toString())} />
                    <Button type="Edit" click={showEditBox} />
                  </div>
                ) :
                  <Button click={showReplyBox} type="Reply" />)
              }
</div>
            </div>
          }
        </main>
      </div>
      <div className="w-full flex flex-col items-end lg:w-95% xl:-11/12 border-0 border-l-2 border-solid border-l-light-gray gap-y-4">
        {
          reply &&
          reply.id === post._id &&
          <Replybox />
        }
        {pathname === "/post" &&
          post.replies.map((reply) => (<Reply post={reply as IReplyProps} key={reply?._id.toString()} />))
        }
      </div>
    </div>
  )
}

export default Post
