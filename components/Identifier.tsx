"use client"

import Image from "next/image"
import Link from "next/link"
import dp from '@/app/favicon.ico'
import { IIdentifierProps } from "@/utils/types"
import { useSession } from "next-auth/react"

const Identifier: React.FC<IIdentifierProps> = ({image, username, dateCreated}) => {
  const {data: session} = useSession();

  return (
    <div className="flex gap-3 text-xs xs:text-sm items-center text-dark-blue">
      <Link href={`/profile`}>
        <Image
          className="rounded-full"
          alt="profile"
          src={image || dp}
          width={28}
          height={28} />
      </Link>

      <Link href={`/profile`}>
        <p className="font-semibold">{username}</p>
      </Link>

      {
        session?.user.name.replace(" ", "").toLocaleLowerCase() === username &&
        <span className="bg-blue text-white px-1.5 py-0.5 rounded">you</span>
      }

      <p>{dateCreated}</p>
    </div>
  )
}

export default Identifier
