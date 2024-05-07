import Image from "next/image"
import Link from "next/link"
import dp from '@/app/favicon.ico'
import { IIdentifierProps } from "@/utils/types"

const Identifier: React.FC<IIdentifierProps> = ({image, username, dateCreated}) => {
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

      <p>{dateCreated}</p>
    </div>
  )
}

export default Identifier
