/* eslint-disable react/no-unescaped-entities */
"use client"

import { myContext } from "@/utils/context";
import { useContext } from "react";

const DeleteModal = () => {
  const { popUpDelete } = useContext(myContext);
  const { toDelete } = useContext(myContext);
  const { setShowDelete } = useContext(myContext);

  const deleteComment = async () => {
    try {
      const response = await fetch(`/api/posts/${toDelete}`,{
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data, "set")
  
      if (response.ok) {
        setShowDelete(false);
      }
      
    } catch (error) {
      console.log(error, "sechi")
    }
  }

  return (
    <>
      <div className="fixed w-screen h-screen bg-black opacity-60 top-0 z-50 left-0"></div>
      <div className="fixed w-screen h-screen flex justify-center items-center px-4 xs:p-0 z-50 top-0 left-0">
        <main className="bg-white p-7 opacity-100 flex flex-col gap-5 rounded-md xs:w-96">
          <h4 className="text-dark-blue font-semibold text-xl">Delete Post</h4>
          <p className="text-contents text-lg">
            Are you sure you want to delete this comment? This will remove the comment and can't be undone.
          </p>
          <footer className="grid grid-cols-2 gap-4">
            <button className="py-3 text-white font-medium text-sm bg-contents rounded-md" onClick={() => popUpDelete(null)}>NO, CANCEL</button>
            <button className="py-3 text-white font-medium bg-red rounded-md text-sm" onClick={deleteComment}>YES, DELETE</button>
          </footer>
        </main>
      </div>
    </>
  )
}

export default DeleteModal
