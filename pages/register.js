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
    <div className="flex justify-center mt-10">
      <form onSubmit={register} className="space-y-4 bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          className="border border-gray-300 p-3 w-full rounded-md focus:ring focus:ring-blue-200"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="border border-gray-300 p-3 w-full rounded-md focus:ring focus:ring-blue-200"
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md" type="submit">Register</button>
      </form>
    </div>
  )
}
