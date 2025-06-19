import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function login(e) {
    e.preventDefault()
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.push('/')
    }
  }

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={login} className="space-y-4 bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md" type="submit">Login</button>
      </form>
    </div>
  )
}
