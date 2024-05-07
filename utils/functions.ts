import { Schema } from "mongoose";
import { IDateAPIResponse, INewPost } from "./types";

let prevScrollPos: number = window.scrollY;

export const date = (): Promise<Date> => {
  // const res: Respo = fetch ("https://worldtimeapi.org/api/timezone/Africa/Lagos");
  // const data = await res.json();
  try {
    return fetch ("https://worldtimeapi.org/api/timezone/Africa/Lagos")
    .then(response => response.json())
    .then((data: IDateAPIResponse) => new Date(data.datetime));
  } catch (error: any) {
    return error
  }
}

export const getTimeDifference = async (recordedDateString: Date) => {
  // Convert the recorded date string to a Date object
  const recordedDate = new Date(recordedDateString);

  // Get the current date and time
  const currentDate = await date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate.getTime() - recordedDate.getTime();

  // Convert milliseconds to hours, minutes, and seconds
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
  const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const seconds = Math.floor(timeDifference / 1000);

  // Return the formatted time difference
  if (years > 0) return `${years} ${years < 2 ? "year" : "years"} ago`;
  else if (months > 0) return `${months} ${months < 2 ? "month" : "months"} ago`;
  else if (weeks > 0) return `${weeks} ${weeks < 2 ? "week" : "weeks"} ago`;
  else if (days > 0) return `${days} ${days < 2 ? "day" : "days"} ago`;
  else if (hours > 0) return `${hours} ${hours < 2 ? "hour" : "hours"} ago`;
  else if (minutes > 0) return `${minutes} ${minutes < 2 ? "minute" : "minutes"} ago`;
  else return `${seconds} ${seconds < 2 ? "second" : "seconds"} ago`;
}

export const onScroll = (setFixed: (fixed: boolean) => void) => {
  // current scroll position
  const currentScrollPos: number = window.scrollY;

  // if the user scrolls up
  if (prevScrollPos > currentScrollPos) setFixed(true);
  else {
    // get the height of the window plus the scroll position
    const scrolledTo: number = window.scrollY + window.innerHeight;

    // change the text box from fixed and scroll to bottom of page
    if (document.body.scrollHeight === scrolledTo) setFixed(false);
  }

  // updates the value of scroll position
  prevScrollPos = currentScrollPos;
}

export const onScrollForNavigationBar = (setFixed: (fixed: boolean) => void, fixed:boolean) => {
  // current scroll position
  const currentScrollPos: number = window.scrollY;

  if (prevScrollPos > currentScrollPos) {
    // user has scrolled up
    console.log("up")
    if (currentScrollPos === 0) {
      setFixed(false);
      console.log(fixed)
    }
    else {
      setFixed(true);
      console.log(fixed)
    }
  } else setFixed(false);

  // update previous scroll position
  prevScrollPos = currentScrollPos;
}

export const fetchPosts = async () => {
  try {
    const res = await fetch("/api/posts/all");
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}


export const postComment = async (
  e: any,
  content: string,
  userId: Schema.Types.ObjectId,
  setSubmitting: (submitting: boolean) => void,
  setContent: (content: string) => void,
) => {
  e.preventDefault();
  setSubmitting(true);


  const newPost: INewPost = {
    userId: userId,
    content: content,
    likes: 0,
    dateCreated: new Date(),
  }

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
    setSubmitting(false);
  }
}
