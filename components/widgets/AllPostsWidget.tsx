import PostWidget from "./PostWidget"

const AllPostsWidget = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center py-5 md:py-8 animate-pulse">
      <PostWidget/>
      <PostWidget/>
      <PostWidget/>
    </div>
  )
}

export default AllPostsWidget
