"use client"

import Image from "next/image";
import dp from '@/app/favicon.ico'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useSession } from "next-auth/react";
import { myContext } from "@/utils/context";
import { date } from "@/utils/functions";


const Replybox = () => {
  const { data: session } = useSession();
  const { reply, setReply } = useContext(myContext);
  const [content, setContent] = useState<string>(reply && `@${reply.username} `);
  const input = useRef<HTMLTextAreaElement>(null);
  const form = useRef<HTMLFormElement>(null);
  let submitting: boolean = false;

  const submitReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitting = true;

    const newReply = {
      userId: session?.user.id,
      content: content.split(" ").slice(1).join(" ").toString(),
      likes: 0,
      dateCreated: await date(),
      postId: reply.postId,
      replyingTo: content.split(" ")[0].substring(1),
    }

    try {
      const response = await fetch("/api/reply/new", {
        method: "POST",
        body: JSON.stringify(newReply)
      });

      const pushData = await response.json();
      console.log(pushData)

      if (response.ok) {
        setReply(null);
        setContent("")
      };

    } catch (error) {
      throw error
    } finally {
      submitting = false;
    }
  }

  useLayoutEffect(() => {
    if (input.current) {
      input.current.style.height = 'inherit';
      // Check if scrollHeight is more than 240
      const newHeight = input.current.scrollHeight > 240 ? 240 : input.current.scrollHeight;
      input.current.style.height = `${newHeight}px`;
      console.log(input.current.style.height);
    }
  }, [content]);

  useEffect(() => {
    if (input.current) {
      input.current.setSelectionRange(input.current.value.length, input.current.value.length);
      input.current.focus();
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const parentElement = form.current;
      if (parentElement && !parentElement.contains(event.target as Node)) {
        // If this checks through it means the userClicked outside the parent element
        setReply(null)
      }
    };  

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setReply]);

  return (
    <>
    {
      reply &&
      reply.show &&
        <form onSubmit={(e) => submitReply(e)} className="bg-white shadow-lg rounded-md flex gap-3 items-start p-5 w-95%" ref={form}>
          <Image
            alt="dp"
            src={session?.user.image || dp}
            height={30}
            width={30}
            className="hidden sm:block" />

          <textarea value={content} required disabled={submitting} ref={input}
            onChange={
              (e) => {
                /* this takes the contents imputed by the user and stores
                it inside the container "content"*/
                if (e.target.value === `@${reply.username}`) e.target.value = (`@${reply.username} `);
                else setContent(e.target.value);
              }
            }
            className="textbox" />
          {
            //send button for desktop view
            <button type="submit" className="action-btn hidden xl:block"
              disabled={submitting}>
              {submitting ? `SENDING...` : `SEND`}
            </button>
          }
          {
            //send btn for tablet and mobile view 
            <button className="text-blue xl:hidden text-2xl">
              <IoIosSend />
            </button>
          }
        </form>
    }
    </>
  )
}

export default Replybox
