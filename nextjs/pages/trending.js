import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Trending() {
  const [posts, setPosts] = useState([])
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    fetch('/api/posts?trending=1').then(r => r.json()).then(setPosts)
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
      setPosts(posts.map(p => (p.id === id ? updated : p)))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <Link href="/">Home</Link>
      <ul className="mt-4 space-y-2">
        {posts.map(p => (
          <li key={p.id} className="border p-2 rounded">
            <Link href={`/posts/${p.id}`}>{p.content}</Link>
            <div className="text-sm text-gray-500">
              by <Link href={`/users/${p.userId}`}>{usersMap[p.userId] || 'User'}</Link>
            </div>
            <button onClick={() => like(p.id)} className="mt-1 bg-pink-500 text-white px-2 rounded">
              Like ({p.likes || 0})
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
