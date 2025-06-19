import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../../components/Avatar'
import VideoEmbed from '../../components/VideoEmbed'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [user, setUser] = useState(null)
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    if (!id) return
    fetch('/api/posts?id=' + id).then(r => r.json()).then(setPost)
    fetch('/api/comments?postId=' + id).then(r => r.json()).then(setComments)
    fetch('/api/session').then(r => r.json()).then(setUser)
    fetch('/api/users').then(r => r.json()).then(list => {
      const m = {}
      list.forEach(u => (m[u.id] = { username: u.username, avatarUrl: u.avatarUrl }))
      setUsersMap(m)
    })
  }, [id])

  async function addComment(e) {
    e.preventDefault()
    if (!user) return
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id, content: commentText })
    })
    if (res.ok) {
      const c = await res.json()
      setComments([...comments, c])
      setCommentText('')
    }
  }

  async function likePost() {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) setPost(await res.json())
  }

  if (!post) return <p>Loading...</p>

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <Avatar url={usersMap[post.userId]?.avatarUrl} size={24} />
          <Link href={`/users/${post.userId}`}>{usersMap[post.userId]?.username || 'User'}</Link>
        </div>
        <p className="mb-2">{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-2 max-w-xs" />}
        <VideoEmbed url={post.videoUrl} />
        <button onClick={likePost} className="block mt-2 bg-pink-500 text-white px-2 py-1 rounded">
          Like ({post.likes || 0})
        </button>
      </div>
      <h2 className="text-xl font-bold mt-6">Comments</h2>
      <ul className="space-y-2">
        {comments.map(c => (
          <li key={c.id} className="border p-2 rounded bg-white flex gap-2">
            <Avatar url={usersMap[c.userId]?.avatarUrl} size={32} />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href={`/users/${c.userId}`}>{usersMap[c.userId]?.username || 'User'}</Link>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p>{c.content}</p>
            </div>
          </li>
        ))}
      </ul>
      {user && (
        <form onSubmit={addComment} className="mt-4 flex gap-2">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="border p-1 flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 rounded">Add</button>
        </form>
      )}
    </div>
  )
}
