import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(u => setUser(u))
  }, [])

  useEffect(() => {
    let timer
    async function check() {
      const r = await fetch('/api/unreadMessages')
      if (r.ok) {
        const data = await r.json()
        setUnread(data.count)
      }
    }
    if (user) {
      check()
      timer = setInterval(check, 10000)
    }
    return () => clearInterval(timer)
  }, [user])

  async function logout() {
    await fetch('/api/session', { method: 'DELETE' })
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">TongXin</Link>
          <nav className="space-x-4 flex items-center">
            <Link href="/home">Home</Link>
            <Link href="/trending">Trending</Link>
            <Link href="/search">Search</Link>
            {user && (
              <Link href="/messages">
                Messages
                {unread > 0 && (
                  <span className="ml-1 text-sm text-red-500">({unread})</span>
                )}
              </Link>
            )}
            {user && <Link href="/compose">New Post</Link>}
            {user ? (
              <>
                <Link href="/profile">Profile</Link>
                <button onClick={logout} className="ml-2 text-sm text-gray-600">Logout</button>
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
      <main className="w-full p-4">{children}</main>
    </div>
  )
}
