import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'
import ComposeForm from '../components/ComposeForm'

export default function Shorts() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [offset, setOffset] = useState(0)
  const loader = useRef(null)
  const limit = 5

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl, verified: u.verified }))
      setUsersMap(m)
    })
    load()
  }, [])

  async function load() {
    const res = await fetch(`/api/posts?video=1&offset=${offset}&limit=${limit}`)
    if (res.ok) {
      const data = await res.json()
      setPosts(p => [...p, ...data])
      setOffset(o => o + limit)
    }
  }

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) load()
    })
    if (loader.current) obs.observe(loader.current)
    return () => obs.disconnect()
  }, [loader.current])

  async function like(id) {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts(ps => ps.map(p => (p.id === id ? updated : p)))
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
      setPosts(p => [post, ...p])
    }
  }

  return (
    <div>
      <ComposeForm onPost={post => setPosts([post, ...posts])} />
      <div className="space-y-6 mt-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded shadow p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Avatar url={usersMap[p.userId]?.avatarUrl} size={24} />
              <Link href={`/users/${p.userId}`}>{usersMap[p.userId]?.username || 'User'}</Link>
              {usersMap[p.userId]?.verified && <span className="text-blue-500">\u2713</span>}
              <span>{new Date(p.createdAt).toLocaleString()}</span>
              {p.location && <span>{p.location}</span>}
            </div>
            <VideoEmbed url={p.videoUrl} />
            <p className="mt-2 mb-2">{p.content}</p>
            <div className="flex gap-2">
              <button onClick={() => like(p.id)} className="bg-pink-500 text-white px-2 py-1 rounded">
                {p.liked ? 'Unlike' : 'Like'} ({p.likes || 0})
              </button>
              <button onClick={() => repost(p.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                Repost
              </button>
            </div>
          </div>
        ))}
        <div ref={loader} className="h-6" />
      </div>
    </div>
  )
}
