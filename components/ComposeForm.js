import { useState, useEffect } from 'react'
import Avatar from './Avatar'

export default function ComposeForm({ onPost }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [location, setLocation] = useState('')

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords
          try {
            const res = await fetch(
              `/api/geocode?lat=${latitude}&lon=${longitude}`
            )
            if (res.ok) {
              const data = await res.json()
              if (data.location) setLocation(data.location)
            }
          } catch (e) {
            /* ignore */
          }
        },
        () => setLocation('')
      )
    }
  }, [])

  async function createPost(e) {
    e.preventDefault()
    if (!user) return
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, videoUrl, location })
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

  function handleDrop(e) {
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      e.preventDefault()
      const reader = new FileReader()
      reader.onload = () => setVideoUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }

  if (!user) return null

  return (
    <form onSubmit={createPost} className="mt-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border flex gap-3 shadow">
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
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
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
        <div className="flex items-center justify-end mt-3">
          {content.trim() && (
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-full"
              type="submit"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
