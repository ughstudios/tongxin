import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'

export default function Trending() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    fetch('/api/posts?trending=1').then(r => r.json()).then(setPosts)
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
      setPosts(posts.map(p => (p.id === id ? updated : p)))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow p-3">
            <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Avatar url={usersMap[p.userId]?.avatarUrl} size={24} />
              <Link href={`/users/${p.userId}`}>{usersMap[p.userId]?.username || 'User'}</Link>
              <span>{new Date(p.createdAt).toLocaleString()}</span>
              {p.location && <span>{p.location}</span>}
            </div>
            <VideoEmbed url={p.videoUrl} />
            <button onClick={() => like(p.id)} className="bg-pink-500 text-white px-2 py-1 rounded">
              Like ({p.likes || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
