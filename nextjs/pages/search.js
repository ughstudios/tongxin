import { useState } from 'react'
import Link from 'next/link'

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
      list.forEach(u => (m[u.id] = u.username))
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Posts</h1>
      <Link href="/">Home</Link>
      <form onSubmit={doSearch} className="my-4">
        <input value={q} onChange={e => setQ(e.target.value)} className="border p-1" />
        <button className="ml-2 px-2 py-1 bg-blue-500 text-white rounded" type="submit">Search</button>
      </form>
      <ul className="space-y-2">
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
