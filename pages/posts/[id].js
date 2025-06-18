import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch('/api/posts?id=' + id).then(r => r.json()).then(setPost)
    fetch('/api/comments?postId=' + id).then(r => r.json()).then(setComments)
    fetch('/api/session').then(r => r.json()).then(setUser)
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
        <p className="mb-2">{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-2 max-w-xs" />}
        {post.videoUrl && <video src={post.videoUrl} controls className="mt-2 max-w-xs" />}
        <button onClick={likePost} className="block mt-2 bg-pink-500 text-white px-2 py-1 rounded">
          Like ({post.likes || 0})
        </button>
      </div>
      <h2 className="text-xl font-bold mt-6">Comments</h2>
      <ul className="space-y-2">
        {comments.map(c => (
          <li key={c.id} className="border p-2 rounded bg-white">{c.content}</li>
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
