"use client"

import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa"

interface likeProps {
  desktop?: boolean,
  likes: number,
}

const LikeButton: React.FC<likeProps> = ({ desktop, likes }) => {
  const [liked, setLiked] = useState<boolean>(false);
  return (
    <button className={`flex gap-3 items-center ${desktop && "flex-col"}`}>
      {<FaPlus className={`${liked && "hidden"} icons`} />}

      <p className="font-medium text-blue">{likes}</p>

      {<FaMinus className={`${!liked && "hidden"} icons`} />}

    </button>
  )
}

export default LikeButton
