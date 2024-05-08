import BackBtn from "@/components/Back";
import Profile from "@/components/Profile";
import ProfileContents from "@/components/ProfileContents";

const ProfilePage = () => {
  return (
    <div className="w-screen bg-background min-h-screen flex-col flex items-center">
        <BackBtn />
        <main className="align-page">
        <Profile />
        <ProfileContents />
      </main>
    </div>
  )
}

export default ProfilePage
