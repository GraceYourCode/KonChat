import { createContext } from "react";

interface IContext {
  reply: {
    id: string,
    postId: string
    username: string
    show: boolean
  };
  setReply: React.Dispatch<React.SetStateAction<{
    id: string,
    postId: string
    username: string
    show: boolean
  }>>;
};

export const myContext = createContext<IContext | any | null>(null);
