import dynamic from 'next/dynamic';

const AllPosts = dynamic(() => import('@/components/AllPosts'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="bg-background">
      <AllPosts />
    </div>
  );
}
