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
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
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
        }} className="border border-gray-300 p-2 rounded-md" />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md" type="submit">Save</button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">Your Posts</h2>
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <Link href={`/posts/${p.id}`} className="font-medium block mb-1">{p.content}</Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Avatar url={profile.avatarUrl} size={24} />
                <span>{profile.username}</span>
              </div>
              {p.imageUrl && <img src={p.imageUrl} alt="" className="mt-2 max-w-full rounded-md" />}
              <VideoEmbed url={p.videoUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
