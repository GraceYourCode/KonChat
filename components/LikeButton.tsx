"use client"

import { Schema } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface likeProps {
  desktop?: boolean;
  likes: number;
  id: string;
  usersThatLiked: Array<Schema.Types.ObjectId | null>;
}

const LikeButton: React.FC<likeProps> = ({ desktop, likes, id, usersThatLiked }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean>(false);

  const likeOrUnlike = async () => {
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
        if (each === session?.user.id) {
          setLiked(true);
        } else {
          setLiked(false);
        } 
      })

  }, [session?.user.id, usersThatLiked])

  return (
    <>
    {
      desktop ?
    <button className={`flex gap-3 items-center flex-col bg-background px-4 rounded-lg py-2`}>
      {session?.user && <FaPlus className={`${liked && "hidden"} icons`} onClick={likeOrUnlike} />}

      <p className="font-medium text-blue">{likes}</p>

      {session?.user && <FaMinus className={`${!liked && "hidden"} icons`} onClick={likeOrUnlike} />}

    </button> :
      <div className="flex items-center text-red font-medium" onClick={session?.user && likeOrUnlike}>
        {
          liked ? <FcLike className="text-gray-blue"/>:<FcLikePlaceholder/>
        }
        
        <small>{likes}</small>
      </div>
    }
    </>
  )
}

export default LikeButton
