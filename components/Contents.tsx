const Contents = ({content}: {content: string}) => {
  const formattedContent = content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);

  return (
    <p className="text-sm text-contents">
     {formattedContent}
    </p>
  )
}

export default Contents