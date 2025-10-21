import Interactive404 from '@/components/interactive-404'

export default function NotFound() {
  return (
    <Interactive404 
      title="Oops! Page Not Found"
      description="The page you're looking for seems to have wandered off. Don't worry, even our best rubber gaskets sometimes slip away!"
      showSearch={true}
    />
  )
}