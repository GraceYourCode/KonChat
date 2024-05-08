import Link from "next/link";

const Contents = ({content}: {content: string}) => {
  const formattedContent = content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);

  return (
    <p className="text-sm text-contents">
      {
        content.length > 200 ?
        (
          <>
          {content.substring(0, 200)}...
          <Link href="/chat" className="text-blue">see more</Link>
          </>
        ) : 
        content
      }
    </p>
  )
}

export default Contents