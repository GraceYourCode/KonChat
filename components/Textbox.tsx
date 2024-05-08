import Image from "next/image";
import dp from '@/app/favicon.ico'
import { IoIosSend } from "react-icons/io";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { date } from "@/utils/functions";
import { useSession } from "next-auth/react";
import { INewPost } from "@/utils/types";
import { Schema } from "mongoose";

const Textbox = () => {
  const [content, setContent] = useState<string>("");
  let submitting: boolean = false;
  const input = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitting = true;


    const newPost: INewPost = {
      userId: session?.user.id as Schema.Types.ObjectId,
      content: content,
      likes: 0,
      dateCreated: await date(),
    }

    console.log(newPost);

    try {
      const response: Response = await fetch("/api/posts/new", {
        method: "POST",
        body: JSON.stringify(newPost)
      });

      const data = await response.json();
      console.log(data)

      //re-routes to home page
      if (response.ok) {
        console.log(data, "success");
        setContent("")
      };

    } catch (error) {
      console.log(error);
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
  


  if (!session) return (<></>);

  return (
    <div className={`fixed pb-3 md:pb-5 w-screen bottom-0 bg-background z-20 flex justify-center`}>
      <div className="align-page">
      <form className="bg-white shadow-lg rounded-md flex gap-3 items-start p-5" onSubmit={(e) => submitPost(e)}>
        <Image
          alt="dp"
          src={session?.user.image as string || dp}
          height={30}
          width={30}
          className="hidden sm:block rounded-full" />

        <textarea value={content} required disabled={submitting} ref={input}
          onChange={
            (e) => {
              /* this takes the contents imputed by the user and stores
              it inside the container "content"*/
              setContent(e.target.value)
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
          <button className="text-blue xl:hidden text-3xl sm:text-4xl">
            <IoIosSend />
          </button>
        }
      </form>
      </div>
    </div>
  )
}

export default Textbox
