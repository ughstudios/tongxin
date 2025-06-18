import { useState, useEffect } from 'react'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        setProfile(data)
        if (data && data.avatarUrl) setAvatar(data.avatarUrl)
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
    <div className="max-w-sm mx-auto mt-6">
      {profile.avatarUrl && (
        <img src={profile.avatarUrl} alt="avatar" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
      )}
      <h1 className="text-xl font-bold text-center mb-4">{profile.username}</h1>
      <form onSubmit={save} className="space-y-3 bg-white p-6 rounded shadow">
        <input
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder="Avatar URL"
          className="border p-2 w-full rounded"
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded" type="submit">Save</button>
      </form>
    </div>
  )
}
