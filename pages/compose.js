import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Avatar from '../components/Avatar'

export default function Compose() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [content, setContent] = useState('')
  // Not separate text boxes – these just hold previews for pasted media
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(u => {
      setUser(u)
      if (u) {
        fetch('/api/profile').then(r => r.json()).then(setProfile)
      }
    })
  }, [])

  async function createPost(e) {
    e.preventDefault()
    if (!user) return
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, videoUrl })
    })
    if (res.ok) {
      const post = await res.json()
      router.push('/posts/' + post.id)
    }
  }

  function handlePaste(e) {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = () => setImageUrl(reader.result)
          reader.readAsDataURL(file)
          e.preventDefault()
          return
        }
      }
    }
    const text = e.clipboardData.getData('text')
    if (text) {
      const m = text.match(/https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/[^\s]+)/)
      if (m) setVideoUrl(m[0])
    }
  }

  if (!user) return <p className="mt-4">Please login first.</p>

  return (
    <div className="max-w-xl mx-auto mt-6">
      <form onSubmit={createPost} className="bg-white rounded shadow p-4 flex gap-3">
        <Avatar url={profile?.avatarUrl} size={48} />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => {
              const val = e.target.value
              setContent(val)
              const m = val.match(/https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/[^\s]+)/)
              if (m) setVideoUrl(m[0])
            }}
            onPaste={handlePaste}
            placeholder="What's happening?"
            className="w-full resize-none focus:outline-none border-b border-gray-300 p-2"
          />
          {imageUrl && (
            <img src={imageUrl} alt="preview" className="w-32 h-32 object-cover rounded mt-2" />
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-3 float-right">
            Post
          </button>
        </div>
      </form>
    </div>
  )
}
