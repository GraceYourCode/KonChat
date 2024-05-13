"use client"

import { useState } from "react";
import { myContext } from "@/utils/context"
import UsersPosts from "./UsersPosts"
import { IPostProps, IReplyState } from "@/utils/types";
import DeleteModal from "./DeleteModal";
import UserReplies from "./UserReplies";
import UserLikes from "./UserLikes";

const options: string[] = ["Posts", "Replies", "Likes"]
const ProfileContents = () => {
  const [reply, setReply] = useState<IReplyState | null>(null);
  const [posts, setPosts] = useState<IPostProps[]>();
  const [edit, setEdit] = useState<IReplyState | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [active, setActive] = useState<string>("Posts");

  const popUpDelete = (id: string | null) => {
    setShowDelete(prev => !prev);
    setToDelete(id);
  }

  return (
    <myContext.Provider value={{
      posts, setPosts,
      reply, setReply,
      edit, setEdit,
      toDelete, popUpDelete,
      setShowDelete,
    }}>
      <div>
        <header className="grid grid-cols-3 xs:flex gap-4 xs:gap-12 border-solid border-0 border-b-2 border-light-gray">
          {
            options.map(option => (
              <p className={`${active===option && "border-0 border-b-2 border-solid border-blue"} xs:px-9 xs:py-3 py-2 text-contents text-center xl:hover:bg-gray-blue cursor-pointer`} key={option}
              onClick={() => setActive(option)}>{option}</p>
            ))
          }

        </header>
        {active === "Posts" && <UsersPosts />}
        {active === "Replies" && <UserReplies />}
        {active === "Likes" && <UserLikes />}
        {showDelete && <DeleteModal />}
      </div>
    </myContext.Provider>
  )
}

export default ProfileContents
