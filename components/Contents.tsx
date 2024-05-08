"use client"

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

const Contents = ({content, id}: {content: string, id?:string}) => {
  const pathname = usePathname();
  const router = useRouter();
  const formattedContent = content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);

  return (
    <p className="text-sm text-contents">
      
      {
        pathname === "/post" ?
        formattedContent:
        content.length > 200 ?
        (
          <>
          {content.substring(0, 200)}...
          <button onClick={(e)=>{
            e.stopPropagation();
            router.push(`/post?id=${id}`);
          }} className="text-blue font-medium italic">see more</button>
          </>
        ) : 
        content
      }
    </p>
  )
}

export default Contents