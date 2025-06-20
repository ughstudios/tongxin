import ComposeForm from '../components/ComposeForm'
import { useRouter } from 'next/router'

export default function Compose() {
  const router = useRouter()

  function handlePost(post) {
    router.push('/posts/' + post.id)
  }

  return (
    <div className="max-w-xl mx-auto mt-6">
      <ComposeForm onPost={handlePost} />
    </div>
  )
}
