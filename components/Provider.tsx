"use client"

import { IProvider } from "@/utils/types"
import { SessionProvider } from "next-auth/react"

const Provider: React.FC<IProvider> = ({ children }) => {
  // const {data: session} = useSession();
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default Provider