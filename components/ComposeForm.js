import { useState, useEffect } from 'react'
import Avatar from './Avatar'

export default function ComposeForm({ onPost }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(u => {
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
      if (onPost) onPost(post)
      setContent('')
      setImageUrl('')
      setVideoUrl('')
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

  if (!user) return null

  return (
    <form onSubmit={createPost} className="mt-6 space-y-3 bg-white p-4 rounded-lg shadow-md">
      <div className="flex gap-3">
        <Avatar url={profile?.avatarUrl} size={48} />
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
          className="border border-gray-300 p-3 w-full rounded-md resize-none focus:ring focus:ring-blue-200"
        />
      </div>
      {imageUrl && (
        <img src={imageUrl} alt="preview" className="w-full max-h-64 object-cover rounded-md" />
      )}
      <div className="text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md" type="submit">
          Post
        </button>
      </div>
    </form>
  )
}
