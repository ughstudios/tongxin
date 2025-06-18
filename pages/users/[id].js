import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!id) return
    fetch('/api/session').then(r => r.json()).then(setUser)
    fetch('/api/users?id=' + id).then(r => r.json()).then(setProfile)
    fetch('/api/posts?userId=' + id).then(r => r.json()).then(setPosts)
  }, [id])

  async function follow() {
    await fetch('/api/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id) })
    })
    setUser({ ...user, following: [...(user.following || []), Number(id)] })
  }

  async function unfollow() {
    await fetch('/api/follows', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id) })
    })
    setUser({ ...user, following: (user.following || []).filter(f => f !== Number(id)) })
  }

  if (!profile) return <p>Loading...</p>

  const isFollowing = user && (user.following || []).includes(Number(id))

  return (
    <div>
      <Link href="/">Home</Link>
      <h1 className="text-2xl font-bold mt-4">{profile.username}</h1>
      {user && user.id !== Number(id) && (
        isFollowing ? (
          <button onClick={unfollow} className="mt-2 bg-gray-300 px-2 rounded">Unfollow</button>
        ) : (
          <button onClick={follow} className="mt-2 bg-blue-500 text-white px-2 rounded">Follow</button>
        )
      )}
      <ul className="mt-4 space-y-2">
        {posts.map(p => (
          <li key={p.id} className="border p-2 rounded">
            <Link href={`/posts/${p.id}`}>{p.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
