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
      <form onSubmit={doSearch} className="my-4 flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-grow"
        />
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" type="submit">Search</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
            <div className="text-sm text-gray-500 mb-2">
              by <Link href={`/users/${p.userId}`}>{usersMap[p.userId] || 'User'}</Link>
            </div>
            <button onClick={() => like(p.id)} className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md">
              Like ({p.likes || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
