import { useState } from 'react'
import Link from 'next/link'
import { HeartIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

export default function Search() {
  const [q, setQ] = useState('')
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})

  async function doSearch(e) {
    e.preventDefault()
    const res = await fetch('/api/posts?q=' + encodeURIComponent(q))
    setPosts(await res.json())
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, verified: u.verified }))
      setUsersMap(m)
    })
  }

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
      <h1 className="text-2xl font-bold mb-4">Search Posts</h1>
      <form onSubmit={doSearch} className="my-4 flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border p-1 flex-grow rounded bg-white dark:bg-gray-700 dark:text-gray-100"
        />
        <button className="px-3 py-1 bg-blue-500 text-white rounded" type="submit">Search</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
            <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
            <div className="text-sm text-gray-500 mb-2">
              by <Link href={`/users/${p.userId}`}>{usersMap[p.userId]?.username || 'User'}</Link>
              {usersMap[p.userId]?.verified && <span className="text-blue-500 ml-1">\u2713</span>}
              <span className="ml-1">{new Date(p.createdAt).toLocaleString()}</span>
              {p.location && <span className="ml-1">{p.location}</span>}
            </div>
            {p.repostId && (
              <p className="text-sm text-gray-500 mb-1">
                Reposted from{' '}
                <Link href={`/users/${p.repostUserId}`}>{usersMap[p.repostUserId]?.username || 'User'}</Link>
              </p>
            )}
            <div className="flex gap-2 mt-2">
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
      </div>
    </div>
  )
}
