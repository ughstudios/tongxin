import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [avatarInput, setAvatarInput] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [feed, setFeed] = useState([])
  const [recs, setRecs] = useState([])
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(u => {
        setUser(u)
        if (u) {
          fetch('/api/profile').then(r => r.json()).then(p => {
            setProfile(p)
            setAvatarInput(p.avatarUrl || '')
          })
        }
      })
    fetch('/api/posts?feed=1').then(r => r.json()).then(setFeed)
    fetch('/api/recommendations').then(r => r.json()).then(setRecs)
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = u.username))
      setUsersMap(m)
    })
  }, [])

  async function like(id) {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      const updated = await res.json()
      setFeed(feed.map(p => (p.id === id ? updated : p)))
    }
  }


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
      setFeed([post, ...feed])
      setContent('')
      setImageUrl('')
      setVideoUrl('')
    }
  }

  async function saveAvatar(e) {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl: avatarInput })
    })
    if (res.ok) {
      setProfile({ ...profile, avatarUrl: avatarInput })
    }
  }

  return (
    <div>
      {profile && (
        <div className="mt-2 flex items-center gap-4">
          {profile.avatarUrl && (
            <img src={profile.avatarUrl} className="w-16 h-16 rounded-full object-cover" alt="avatar" />
          )}
          <form onSubmit={saveAvatar} className="flex-grow flex gap-2">
            <input
              value={avatarInput}
              onChange={e => setAvatarInput(e.target.value)}
              placeholder="Avatar URL"
              className="border p-1 flex-grow rounded"
            />
            <button className="bg-blue-500 text-white px-3 rounded" type="submit">Save</button>
          </form>
        </div>
      )}
      {user && (
        <form onSubmit={createPost} className="mt-4 space-y-2">
          <input value={content} onChange={e => setContent(e.target.value)} placeholder="Say something" className="border p-1 w-full" />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="border p-1 w-full" />
          <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL (optional)" className="border p-1 w-full" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Post</button>
        </form>
      )}
      <h2 className="text-xl font-bold mt-6 mb-2">Feed</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {feed.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
            {p.imageUrl && (
              <img src={p.imageUrl} alt="" className="w-full h-48 object-cover" />
            )}
            <div className="p-3">
              <Link href={`/posts/${p.id}`} className="font-medium block mb-1">
                {p.content}
              </Link>
              <div className="text-sm text-gray-500 mb-2">
                by <Link href={`/users/${p.userId}`}>{usersMap[p.userId] || 'User'}</Link>
              </div>
              {p.videoUrl && <video src={p.videoUrl} controls className="w-full mb-2" />}
              <button
                onClick={() => like(p.id)}
                className="bg-pink-500 text-white px-2 py-1 rounded"
              >
                Like ({p.likes || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-6 mb-2">AI Recommendations</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {recs.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-lg shadow">
            {p.content}
          </div>
        ))}
      </div>
    </div>
  )
}
