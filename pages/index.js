import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [avatarInput, setAvatarInput] = useState('')
  const fileRef = useRef(null)
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
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl }))
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

  function handleAvatarFile(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatarInput(reader.result)
      reader.readAsDataURL(file)
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
          <Avatar url={profile.avatarUrl} size={64} />
          <form onSubmit={saveAvatar} className="flex-grow flex gap-2 items-center">
            <input
              type="file"
              ref={fileRef}
              onChange={handleAvatarFile}
              className="border p-1 rounded"
            />
            <button className="bg-blue-500 text-white px-3 rounded" type="submit">Save</button>
          </form>
        </div>
      )}
      {user && (
        <form onSubmit={createPost} className="mt-4 space-y-2 bg-white p-4 rounded shadow">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's happening?"
            className="border p-2 w-full rounded"
          />
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="border p-1 w-full rounded"
          />
          <input
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="Video or YouTube/Bilibili URL"
            className="border p-1 w-full rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Post</button>
        </form>
      )}
      <h2 className="text-xl font-bold mt-6 mb-2">Home</h2>
      <div className="space-y-4">
        {feed.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
            {p.imageUrl && (
              <img src={p.imageUrl} alt="" className="w-full h-48 object-cover" />
            )}
            <div className="p-3">
              <Link href={`/posts/${p.id}`} className="font-medium block mb-1">
                {p.content}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Avatar url={usersMap[p.userId]?.avatarUrl} size={24} />
                <Link href={`/users/${p.userId}`}>{usersMap[p.userId]?.username || 'User'}</Link>
              </div>
              <VideoEmbed url={p.videoUrl} />
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
      <h2 className="text-xl font-bold mt-6 mb-2">Recommended</h2>
      <div className="space-y-4">
        {recs.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-lg shadow">
            {p.content}
          </div>
        ))}
      </div>
    </div>
  )
}
