import Interactive404 from '@/components/interactive-404'

export default function ProductNotFound() {
  return (
    <Interactive404 
      title="Product Not Found"
      description="This product seems to have rolled away! Don't worry, we have plenty of other high-quality rubber gaskets and sealing solutions waiting for you."
      showSearch={true}
    />
  )
}