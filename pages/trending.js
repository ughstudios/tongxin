import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'

export default function Trending() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [tags, setTags] = useState([])

  useEffect(() => {
    fetch('/api/posts?trending=1').then(r => r.json()).then(setPosts)
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl, verified: u.verified }))
      setUsersMap(m)
    })
    fetch('/api/hashtags').then(r => r.json()).then(setTags)
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

  async function repost(id) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repostId: id })
    })
    if (res.ok) {
      const post = await res.json()
      setPosts([post, ...posts])
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <h2 className="text-xl font-bold mt-2">Trending Hashtags</h2>
      <ul className="mb-4 space-y-1">
        {tags.map(t => (
          <li key={t.tag}>
            <Link href={`/search?q=%23${t.tag}`}>#{t.tag}</Link> ({t.count})
          </li>
        ))}
      </ul>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow p-3">
            <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Avatar url={usersMap[p.userId]?.avatarUrl} size={24} />
              <Link href={`/users/${p.userId}`}>{usersMap[p.userId]?.username || 'User'}</Link>
              {usersMap[p.userId]?.verified && <span className="text-blue-500">\u2713</span>}
              <span>{new Date(p.createdAt).toLocaleString()}</span>
              {p.location && <span>{p.location}</span>}
            </div>
            <VideoEmbed url={p.videoUrl} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => like(p.id)} className="bg-pink-500 text-white px-2 py-1 rounded">
                {p.liked ? 'Unlike' : 'Like'} ({p.likes || 0})
              </button>
              <button onClick={() => repost(p.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                Repost
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
