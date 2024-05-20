"use client"

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";

const Contents = ({ content, replyingTo, id }: { content: string, replyingTo?: string, id?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [click, setClick] = useState<boolean>(false);
  const formattedContent = content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);

  return (
    <p className="text-sm text-contents">

      {
        replyingTo ? (
          <>
            <span className="text-blue font-medium"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile?id=${id}`)
              }
              }>
              {`@${replyingTo} `}
            </span>
            {
              content.length > 200 ?
                (
                  <>
                  {click ? content.substring(0, 200) : formattedContent}...
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setClick(prev => !prev);
                    }} className="text-blue font-medium italic">{click ? "see less" : "see more"}</button>
                  </>
                ) :
                formattedContent
            }

          </>
        ) :
          pathname === "/post" ?
            formattedContent :
            content.length > 200 ?
              (
                <>
                  {click ? content.substring(0, 200) : formattedContent}...
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setClick(prev => !prev);
                  }} className="text-blue font-medium italic">{click ? "see less" : "see more"}</button>
                </>
              ) :
              formattedContent
      }
    </p>
  )
}

export default Contents