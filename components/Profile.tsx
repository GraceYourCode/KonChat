"use client"

import { IUser } from "@/utils/types"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";

const DemoProfile = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/user/${id}`);
      const data: any = await response.json();

      console.log(data)
      setUser(data)
    }

    fetchUser()
  }, [id])

  return (
    <div className="py-4 flex flex-col gap-y-6">
      {
        user &&
        <>
          <Image
            src={user.image as string}
            alt="profile picture"
            width={120}
            height={120}
            quality={100}
            className="rounded-full" />

          <div>
            <header className="font-medium text-dark-blue text-2xl">GraceYourCode</header>
            <p className="text-contents">@graceyourcode</p>
          </div>

          <p className="text-contents text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta recusandae est explicabo architecto necessitatibus incidunt sunt accusamus dolores. Quibusdam, voluptatibus.</p>
        </>
      }
    </div>
  )
}

const Profile = () => {
  return (
    <Suspense>
      <DemoProfile />
    </Suspense>
  )
}

export default Profile
