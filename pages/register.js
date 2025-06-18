import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function register(e) {
    e.preventDefault()
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      router.push('/')
    }
  }

  return (
    <div className="flex justify-center mt-8">
      <form onSubmit={register} className="space-y-3 bg-white p-6 rounded shadow w-full max-w-sm">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="border p-2 w-full rounded"
        />
        <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">Register</button>
      </form>
    </div>
  )
}
