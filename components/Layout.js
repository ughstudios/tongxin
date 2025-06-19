import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(setUser)
  }, [])

  async function logout() {
    await fetch('/api/session', { method: 'DELETE' })
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
        <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
          <Link href="/" className="text-xl font-bold">TongXin</Link>
          <nav className="space-x-4 flex items-center">
            <Link href="/home">Home</Link>
            <Link href="/trending">Trending</Link>
            <Link href="/search">Search</Link>
            {user && <Link href="/compose">New Post</Link>}
            {user ? (
              <>
                <Link href="/profile">Profile</Link>
                <button onClick={logout} className="ml-2 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="w-full p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  )
}
