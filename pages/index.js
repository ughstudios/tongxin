import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import VideoEmbed from '../components/VideoEmbed'
import ComposeForm from '../components/ComposeForm'
import Avatar from '../components/Avatar'
import { HeartIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [offset, setOffset] = useState(0)
  const loader = useRef(null)
  const limit = 20

  useEffect(() => {
    load()
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl, verified: u.verified }))
      setUsersMap(m)
    })
  }, [])

  async function load() {
    const res = await fetch(`/api/recommendations?offset=${offset}&limit=${limit}`)
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
      setPosts([
        post,
        ...posts.map(p =>
          p.id === id
            ? { ...p, repostCount: (p.repostCount || 0) + 1 }
            : p
        )
      ])
    }
  }




  return (
    <div>
      <ComposeForm onPost={post => setPosts([post, ...posts])} />
      <div className="space-y-4 mt-6">
        {posts.map(p => (
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
                {usersMap[p.userId]?.verified && <span className="text-blue-500">\u2713</span>}
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                {p.location && <span>{p.location}</span>}
              </div>
              {p.repostId && (
                <p className="text-sm text-gray-500 mb-1">
                  Reposted from{' '}
                  <Link href={`/users/${p.repostUserId}`}>{usersMap[p.repostUserId]?.username || 'User'}</Link>
                </p>
              )}
              <VideoEmbed url={p.videoUrl} />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => like(p.id)}
                  className="bg-pink-500 text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>({p.likes || 0})</span>
                </button>
                <button
                  onClick={() => repost(p.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                  <span>({p.repostCount || 0})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={loader} className="h-6" />
      </div>
    </div>
  )
}
