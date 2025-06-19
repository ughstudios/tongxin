import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../../components/Avatar'

export default function ThreadPage() {
  const router = useRouter()
  const { id } = router.query
  const [comment, setComment] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyText, setReplyText] = useState('')
  const [user, setUser] = useState(null)
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    if (!id) return
    fetch('/api/comments?id=' + id).then(r => r.json()).then(setComment)
    fetch('/api/comments?parentId=' + id).then(r => r.json()).then(setReplies)
    fetch('/api/session').then(r => r.json()).then(setUser)
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl }))
      setUsersMap(m)
    })
  }, [id])

  async function addReply(e) {
    e.preventDefault()
    if (!user) return
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: comment.postId, parentId: id, content: replyText })
    })
    if (res.ok) {
      const c = await res.json()
      setReplies([...replies, c])
      setReplyText('')
    }
  }

  if (!comment) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Thread</h1>
      <div className="border p-3 rounded bg-white flex gap-2 mb-4">
        <Avatar url={usersMap[comment.userId]?.avatarUrl} size={32} />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/users/${comment.userId}`}>{usersMap[comment.userId]?.username || 'User'}</Link>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
      <ul className="space-y-2 ml-6 border-l-2 border-gray-200 pl-4">
        {replies.map(r => (
          <li key={r.id} className="border p-2 rounded bg-white flex gap-2">
            <Avatar url={usersMap[r.userId]?.avatarUrl} size={32} />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href={`/users/${r.userId}`}>{usersMap[r.userId]?.username || 'User'}</Link>
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p>{r.content}</p>
            </div>
          </li>
        ))}
      </ul>
      {user && (
        <form onSubmit={addReply} className="mt-4 space-y-2 ml-6">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows="3"
            placeholder="Write a reply"
            className="border p-2 w-full rounded resize-none focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Reply</button>
        </form>
      )}
    </div>
  )
}
