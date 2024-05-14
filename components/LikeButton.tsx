"use client"

import pubnub from "@/utils/pubnub";
import { Schema } from "mongoose";
import { useSession } from "next-auth/react";
import { MouseEvent, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface likeProps {
  desktop?: boolean;
  likes: number;
  id: string;
  usersThatLiked: Array<Schema.Types.ObjectId | null>;
}

const LikeButton: React.FC<likeProps> = ({ likes, id, usersThatLiked }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean>(false);

  const likeOrUnlike = async (e: MouseEvent<HTMLElement | SVGElement>) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session?.user.id as Schema.Types.ObjectId),
      });

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      } else {
        try {
          const data = await response.json();
          console.log(data);
          setLiked(prev => !prev);
          pubnub.publish({
            channel: "likes",
            message: { sender: pubnub.getUUID(), content: data },
          })
        } catch (error) {
          console.error('Error parsing JSON', error);
        }
      }
    } catch (error) {
      console.error('Fetch error', error);
    }

  }

  useEffect(() => {
    usersThatLiked &&
      usersThatLiked.includes(session?.user.id as Schema.Types.ObjectId) ?
      setLiked(true) : setLiked(false);

  }, [session?.user.id, usersThatLiked])

  return (
    <>
    {
      <div className="flex items-center w-10 h-10 rounded-full hover:bg-pink-100 justify-center text-red font-medium text-xl cursor-pointer" onClick={likeOrUnlike}>
        {
          liked ? <FcLike/>:<FcLikePlaceholder/>
        }
        
        <p className="text-sm">{likes}</p>
      </div>
    }
    </>
  )
}

export default LikeButton
