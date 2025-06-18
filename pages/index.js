import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [feed, setFeed] = useState([])
  const [recs, setRecs] = useState([])
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(setUser)
    fetch('/api/posts?feed=1').then(r => r.json()).then(setFeed)
    fetch('/api/recommendations').then(r => r.json()).then(setRecs)
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
      setFeed(feed.map(p => (p.id === id ? updated : p)))
    }
  }

  async function login(e) {
    e.preventDefault()
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      const u = await res.json()
      setUser(u)
      setUsername('')
      setPassword('')
      fetch('/api/posts?feed=1').then(r => r.json()).then(setFeed)
    }
  }

  async function logout() {
    await fetch('/api/session', { method: 'DELETE' })
    setUser(null)
    setFeed([])
  }

  async function register(e) {
    e.preventDefault()
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    await login(e)
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">TongXin</h1>
      <nav className="space-x-4">
        <Link href="/feed">Feed</Link>
        <Link href="/trending">Trending</Link>
        <Link href="/search">Search</Link>
      </nav>
      {user ? (
        <div className="mt-2 space-x-2">
          <span>Welcome {user.username}</span>
          <button onClick={logout} className="bg-gray-300 px-2 rounded">Logout</button>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          <form onSubmit={login} className="space-x-2">
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" className="border p-1" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="border p-1" />
            <button className="bg-blue-500 text-white px-2" type="submit">Login</button>
          </form>
          <form onSubmit={register} className="space-x-2">
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" className="border p-1" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="border p-1" />
            <button className="bg-green-500 text-white px-2" type="submit">Register</button>
          </form>
        </div>
      )}
      {user && (
        <form onSubmit={createPost} className="mt-4 space-y-2">
          <input value={content} onChange={e => setContent(e.target.value)} placeholder="Say something" className="border p-1 w-full" />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="border p-1 w-full" />
          <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL (optional)" className="border p-1 w-full" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Post</button>
        </form>
      )}
      <h2 className="text-xl font-bold mt-6 mb-2">Feed</h2>
      <ul className="space-y-2">
        {feed.map(p => (
          <li key={p.id} className="border p-2 rounded">
            <Link href={`/posts/${p.id}`}>{p.content}</Link>
            <div className="text-sm text-gray-500">
              by <Link href={`/users/${p.userId}`}>{usersMap[p.userId] || 'User'}</Link>
            </div>
            {p.imageUrl && <img src={p.imageUrl} alt="" className="mt-2 max-w-xs" />}
            {p.videoUrl && <video src={p.videoUrl} controls className="mt-2 max-w-xs" />}
            <button onClick={() => like(p.id)} className="mt-2 bg-pink-500 text-white px-2 rounded">
              Like ({p.likes || 0})
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">AI Recommendations</h2>
      <ul className="space-y-2">
        {recs.map(p => (
          <li key={p.id} className="border p-2 rounded">{p.content}</li>
        ))}
      </ul>
    </div>
  )
}
