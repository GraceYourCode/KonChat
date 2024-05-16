import PostWidget from "./PostWidget"

const ProfileContentWidget = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center py-5 md:py-8 animate-pulse">
      <PostWidget/>
      <PostWidget/>
    </div>
  )
}

export default ProfileContentWidget
