"use client"

import Image from "next/image"
import dp from '@/app/favicon.ico'
import { IIdentifierProps } from "@/utils/types"
import { useSession } from "next-auth/react"

const Identifier: React.FC<IIdentifierProps> = ({ image, username, dateCreated }) => {
  const { data: session } = useSession();

  return (
    <div className="flex gap-3 text-xs xs:text-sm items-center text-dark-blue">
      <Image
        className="rounded-full cursor-pointer"
        alt="profile"
        src={image || dp}
        width={28}
        height={28} />

      <p className="font-semibold cursor-pointer">{username}</p>

      {
        session?.user.name.replace(" ", "").toLocaleLowerCase() === username &&
        <span className="bg-blue text-white px-1.5 py-0.5 rounded">you</span>
      }

      <p>{dateCreated}</p>
    </div>
  )
}

export default Identifier
