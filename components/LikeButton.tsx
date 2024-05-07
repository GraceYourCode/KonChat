"use client"

import { Schema } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa"

interface likeProps {
  desktop?: boolean;
  likes: number;
  id: string;
  usersThatLiked: Array<Schema.Types.ObjectId | null>;
}

const LikeButton: React.FC<likeProps> = ({ desktop, likes, id, usersThatLiked }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean>(false);

  const likeOrUnlike = async (like: string) => {
    const bodyParams = {
      "userId": session?.user.id,
      "like": like,
    }
    console.log (bodyParams)
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParams),
      });
    
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      } else {
        try {
          const data = await response.json();
          console.log(data);
          setLiked(prev => !prev);
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
      usersThatLiked.map(each => {
        each === session?.user.id ? setLiked(true) : setLiked(false)
      })

  }, [session?.user.id, usersThatLiked])

  return (
    <button className={`flex gap-3 items-center ${desktop && "flex-col"}`}>
      {<FaPlus className={`${liked && "hidden"} icons`} onClick={() => likeOrUnlike("like")} />}

      <p className="font-medium text-blue">{likes}</p>

      {<FaMinus className={`${!liked && "hidden"} icons`} onClick={() => likeOrUnlike("unlike")} />}

    </button>
  )
}

export default LikeButton
