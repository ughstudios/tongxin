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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">TongXin</Link>
          <nav className="space-x-4 flex items-center">
            <Link href="/feed">Feed</Link>
            <Link href="/trending">Trending</Link>
            <Link href="/search">Search</Link>
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
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  )
}
