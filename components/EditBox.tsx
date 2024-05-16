import { useSession } from "next-auth/react";
import Image from "next/image";
import dp from '@/app/favicon.ico'
import { FormEvent, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { myContext } from "@/utils/context";
import pubnub from "@/utils/pubnub";

const EditBox = ({ contentToEdit, id }: { contentToEdit: string, id: string }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState<string>(contentToEdit);
  const input = useRef<HTMLTextAreaElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const { setEdit } = useContext(myContext);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const submitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(content),
      })
      const data: any = await response.json();
      console.log(data)

      if (response.ok) {
        if (typeof data !== "object") {
          setFailed(true)
          setTimeout(() => {
            setFailed(false)
          }, 1000);
        } else {
          setSubmitting(false);
          setEdit(null);
          pubnub.publish({
            channel: "edit",
            message: { sender: pubnub.getUUID(), content: data },
          })
        }
      }
    } catch (error: any) {
      console.log(error)
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
        setEdit(null)
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setEdit]);

  return (
    <form onSubmit={submitEdit} onClick={(e) => e.stopPropagation()} className="bg-white shadow-lg rounded-md flex gap-3 items-start p-5 w-full" ref={form}>
      {
        //for error validtion if delete post fails due to internet or server error
        failed && <aside className="w-48 text-center z-50 fixed top-8 text-white bg-red py-4 rounded-md">Editing Post Failed!</aside>
      }
      <Image
        alt="dp"
        src={session?.user.image || dp}
        height={30}
        width={30}
        className="hidden sm:block" />
      <div className="flex flex-col justify-end items-end w-full gap-3">
        <textarea value={content} required disabled={submitting} ref={input}
          style={{
            height: "inherit",
          }}
          onChange={
            (e) => {
              /* this takes the contents imputed by the user and stores
              it inside the container "content"*/
              setContent(e.target.value)
            }
          }
          className="textbox" />

        <div className="flex gap-3">
          <button className="text-white bg-contents py-2 px-5 text-sm rounded-md" type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEdit(null);
            }}>
            CANCEL
          </button>
          <button type="submit" className="action-btn"
            disabled={submitting}>
            {submitting ? `UPDATING...` : `UPDATE`}
          </button>
        </div>

      </div>
    </form>
  )
}

export default EditBox
