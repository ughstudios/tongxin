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
    if (!content.trim()) return
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, videoUrl })
    })
    if (res.ok) {
      const data = await res.json()
      router.push('/posts/' + data.id)
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
      <form onSubmit={createPost} className="bg-white dark:bg-gray-800 p-4 rounded-xl border flex gap-3 shadow">
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
            rows={3}
            className="w-full resize-none border-none focus:ring-0 text-lg"
          />
          {imageUrl && (
            <img src={imageUrl} alt="preview" className="mt-3 w-full rounded-xl" />
          )}
          {videoUrl && (
            <video src={videoUrl} controls className="mt-3 w-full rounded-xl" />
          )}
          <div className="flex items-center justify-between mt-3">
            <input
              type="file"
              accept="video/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => setVideoUrl(reader.result)
                  reader.readAsDataURL(file)
                }
              }}
              className="text-sm text-gray-600"
            />
            {content.trim() && (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded-full"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
