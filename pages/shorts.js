import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'
import ComposeForm from '../components/ComposeForm'
import { HeartIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import Spinner from '../components/Spinner'

export default function Shorts() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)
  const loader = useRef(null)
  const limit = 5
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl, verified: u.verified }))
      setUsersMap(m)
    })
    load()
  }, [])

  const load = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    const current = offsetRef.current
    offsetRef.current += limit
    setOffset(offsetRef.current)
    try {
      const res = await fetch(`/api/posts?video=1&offset=${current}&limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(p => [...p, ...data])
        if (data.length < limit) setHasMore(false)
      } else {
        setHasMore(false)
      }
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [limit, hasMore])

  useEffect(() => {
    if (!hasMore) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) load()
    })
    const el = loader.current
    if (el) obs.observe(el)
    return () => {
      if (el) obs.unobserve(el)
      obs.disconnect()
    }
  }, [load, hasMore])

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
      setPosts(p => [
        post,
        ...p.map(x =>
          x.id === id
            ? { ...x, repostCount: (x.repostCount || 0) + 1 }
            : x
        )
      ])
    }
  }

  return (
    <div>
      <ComposeForm onPost={post => setPosts([post, ...posts])} />
      <div className="space-y-6 mt-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded shadow p-3">
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
            <p className="mt-2 mb-2">{p.content}</p>
            <div className="flex gap-2">
              <button onClick={() => like(p.id)} className="bg-pink-500 text-white px-2 py-1 rounded flex items-center gap-1">
                <HeartIcon className="w-5 h-5" />
                <span>({p.likes || 0})</span>
              </button>
              <button onClick={() => repost(p.id)} className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1">
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span>({p.repostCount || 0})</span>
              </button>
            </div>
          </div>
        ))}
        {loading && <Spinner />}
        <div ref={loader} className="h-6" />
      </div>
    </div>
  )
}
