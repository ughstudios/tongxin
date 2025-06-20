import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(u => {
        setUser(u)
        if (u && u.theme) setTheme(u.theme)
      })
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  async function logout() {
    await fetch('/api/session', { method: 'DELETE' })
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">TongXin</Link>
          <nav className="space-x-4 flex items-center">
            <Link href="/home">Home</Link>
            <Link href="/trending">Trending</Link>
            <Link href="/search">Search</Link>
            {user && <Link href="/messages">Messages</Link>}
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
