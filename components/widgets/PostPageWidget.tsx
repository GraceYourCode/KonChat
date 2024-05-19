import PostWidget from "./PostWidget"

const PostPageWidget = () => {
  return (
    <div className="flex flex-col items-end w-full gap-4 animate-pulse">
      <PostWidget/>
      <div className="w-95% flex flex-col gap-y-3">
        <PostWidget/>
        <PostWidget/>
        <PostWidget/>
      </div>
    </div>
  )
}

export default PostPageWidget
