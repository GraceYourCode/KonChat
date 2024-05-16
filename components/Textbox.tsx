import Image from "next/image";
import dp from '@/app/favicon.ico'
import { IoIosSend } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { useLayoutEffect, useRef, useState } from "react";
import { date } from "@/utils/functions";
import { useSession } from "next-auth/react";
import { INewPost } from "@/utils/types";
import { Schema } from "mongoose";
import pubnub from "@/utils/pubnub";

const Textbox = ({ post, close }: { post: boolean, close: () => void }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("");
  const input = useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);


    const newPost: INewPost = {
      userId: session?.user.id as Schema.Types.ObjectId,
      content: content,
      likes: 0,
      dateCreated: await date(),
    }

    try {
      const response: Response = await fetch("/api/posts/new", {
        method: "POST",
        body: JSON.stringify(newPost)
      });

      const data = await response.json();

      //re-routes to home page
      if (response.ok) {
        if (typeof data !== "object") {
          setFailed(true)
          setTimeout(() => {
            setFailed(false)
          }, 1000);
        } else {
          console.log(data, "success");
        setContent("");
        close();
        pubnub.publish({
          channel: "posts",
          message: { sender: pubnub.getUUID(), content: data },
        })
      }
      };

    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
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
    <>
      {
        post &&
        <>
          <div className="fixed w-screen h-screen bg-black opacity-60 top-0 z-50"></div>
          {
            //for error validtion if send posts fails due to internet or server error
            failed && <aside className="w-48 text-center z-50 fixed top-8 text-white bg-red py-4 rounded-md">Unable to create post!</aside>
          }
          <div className={`fixed w-screen h-screen z-50 flex justify-center items-center`}>
            <div className="align-page">
              <form className="bg-white shadow-lg rounded-md p-5 relative flex flex-col gap-4" onSubmit={(e) => submitPost(e)}>
                <MdClear className="text-2xl cursor-pointer" onClick={close} />
                <div className="flex gap-3 items-start">
                  <Image
                    alt="dp"
                    src={session?.user.image as string || dp}
                    height={40}
                    width={40}
                    className="rounded-full" />

                  <div className="flex flex-col justify-end items-end w-full gap-3">
                    <textarea value={content} required disabled={submitting} ref={input}
                      onChange={
                        (e) => {
                          /* this takes the contents imputed by the user and stores
                          it inside the container "content"*/
                          setContent(e.target.value)
                        }
                      } placeholder="What's the trend?"
                      style={{
                        border: "none",
                        padding: 0
                      }} autoFocus
                      className="textbox " />

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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default Textbox
