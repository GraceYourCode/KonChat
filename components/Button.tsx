import { IButtonProps } from "@/utils/types";
import { FaReply } from "react-icons/fa";
import { MdOutlineEdit, MdDelete } from "react-icons/md";

const Button: React.FC<IButtonProps> = ({ desktop, type, click }) => {
  return (
    <button className={`${type === "Delete" ? "text-red" : "text-blue"} ${desktop && "hidden sm:flex"} flex gap-1 items-center group text-sm font-medium`} onClick={(e)=>{
      e.stopPropagation();
      click();
    }}>
      {
        type === "Reply" ? <FaReply className="group-hover:text-gray-blue" /> :
          type === "Edit" ? <MdOutlineEdit className="group-hover:text-gray-blue" /> : <MdDelete className="group-hover:text-pale-red" />
      }
      <span className={`${type === "Delete" ? "group-hover:text-pale-red" : "group-hover:text-gray-blue"}`}>{type}</span>
    </button>
  )
}

export default Button
