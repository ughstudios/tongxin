import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Avatar from '../../components/Avatar'

export default function MessagesHome() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(u => {
        if (!u) {
          router.replace('/login')
        } else {
          setMe(u)
          fetch('/api/users')
            .then(r => r.json())
            .then(list => setUsers(list.filter(us => us.id !== u.id)))
        }
      })
  }, [router])

  if (!me) return <p className="mt-4">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id}>
            <Link href={`/messages/${u.id}`} className="flex items-center gap-2">
              <Avatar url={u.avatarUrl} size={32} />
              <span>{u.username}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
