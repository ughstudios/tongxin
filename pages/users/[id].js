import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../../components/Avatar'
import VideoEmbed from '../../components/VideoEmbed'

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (!id) return
    fetch('/api/session').then(r => r.json()).then(setUser)
    fetch('/api/users?id=' + id)
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        if (data.avatarUrl) setAvatar(data.avatarUrl)
      })
    fetch('/api/posts?userId=' + id).then(r => r.json()).then(setPosts)
  }, [id])

  async function save(e) {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl: avatar })
    })
    if (res.ok) setProfile({ ...profile, avatarUrl: avatar })
  }

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

  const isCurrentUser = user && user.id === Number(id)
  const isFollowing = user && (user.following || []).includes(Number(id))

  return (
    <div>
      <div className="flex items-center gap-3 mt-4">
        <Avatar url={profile.avatarUrl} size={48} />
        <h1 className="text-2xl font-bold">{profile.username}</h1>
      </div>
      {isCurrentUser ? (
        <form onSubmit={save} className="mt-2 flex gap-2 items-center">
          <input
            type="file"
            onChange={e => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = () => setAvatar(reader.result)
                reader.readAsDataURL(file)
              }
            }}
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white px-4 rounded" type="submit">Save</button>
        </form>
      ) : (
        user && (
          isFollowing ? (
            <button onClick={unfollow} className="mt-2 bg-gray-300 px-2 rounded">Unfollow</button>
          ) : (
            <button onClick={follow} className="mt-2 bg-blue-500 text-white px-2 rounded">Follow</button>
          )
        )
      )}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-lg shadow">
            <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Avatar url={profile.avatarUrl} size={24} />
              <span>{profile.username}</span>
            </div>
            <VideoEmbed url={p.videoUrl} />
          </div>
        ))}
      </div>
    </div>
  )
}
