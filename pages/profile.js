import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import VideoEmbed from '../components/VideoEmbed'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        setProfile(data)
        if (data && data.avatarUrl) {
          setAvatar(data.avatarUrl)
          fetch('/api/posts?userId=' + data.id)
            .then(r => r.json())
            .then(setPosts)
        }
      })
  }, [])

  async function save(e) {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl: avatar })
    })
    if (res.ok) {
      setProfile({ ...profile, avatarUrl: avatar })
    }
  }

  if (!profile) return <p className="mt-4">Please login first.</p>

  return (
    <div className="max-w-lg mx-auto mt-6 space-y-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <Avatar url={profile.avatarUrl} size={128} />
        <h1 className="text-2xl font-bold mt-2">{profile.username}</h1>
      </div>
      <form onSubmit={save} className="flex gap-2 items-center">
        <input type="file" onChange={e => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => setAvatar(reader.result)
            reader.readAsDataURL(file)
          }
        }} className="border p-2 rounded" />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">Save</button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">Your Posts</h2>
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Avatar url={profile.avatarUrl} size={24} />
                <span>{profile.username}</span>
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                {p.location && <span>{p.location}</span>}
              </div>
              {p.imageUrl && <img src={p.imageUrl} alt="" className="mt-2 max-w-full" />}
              <VideoEmbed url={p.videoUrl} />
              <div className="mt-2 space-x-2 text-sm">
                <Link href={`/posts/${p.id}`}>View</Link>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/posts', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: p.id })
                    })
                    if (res.ok) setPosts(posts.filter(x => x.id !== p.id))
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
