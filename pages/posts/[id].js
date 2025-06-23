import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '../../components/Avatar'
import VideoEmbed from '../../components/VideoEmbed'
import {
  HeartIcon,
  ArrowsRightLeftIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [user, setUser] = useState(null)
  const [usersMap, setUsersMap] = useState({})
  const [editing, setEditing] = useState(false)
  const [formContent, setFormContent] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formVideo, setFormVideo] = useState('')
  const [formLocation, setFormLocation] = useState('')

  useEffect(() => {
    if (!id) return
    fetch('/api/posts?id=' + id)
      .then(r => r.json())
      .then(p => {
        setPost(p)
        setFormContent(p.content || '')
        setFormImage(p.imageUrl || '')
        setFormVideo(p.videoUrl || '')
        setFormLocation(p.location || '')
      })
    fetch('/api/comments?postId=' + id + '&parentId=null')
      .then(r => r.json())
      .then(setComments)
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

  async function repostPost() {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repostId: id })
    })
    if (res.ok) {
      await res.json()
      setPost(p => ({
        ...p,
        repostCount: (p.repostCount || 0) + 1
      }))
    }
  }

  if (!post) return <p>Loading...</p>

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <Avatar url={usersMap[post.userId]?.avatarUrl} size={24} />
          <Link href={`/users/${post.userId}`}>{usersMap[post.userId]?.username || 'User'}</Link>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          {post.location && <span>{post.location}</span>}
        </div>
        {editing ? (
          <div className="space-y-2">
            <textarea
              value={formContent}
              onChange={e => setFormContent(e.target.value)}
              className="border p-2 w-full bg-white"
            />
            <button
              onClick={async () => {
                const res = await fetch('/api/posts', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id,
                    content: formContent,
                    imageUrl: formImage,
                    videoUrl: formVideo,
                    location: formLocation
                  })
                })
                if (res.ok) {
                  setPost(await res.json())
                  setEditing(false)
                }
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} className="ml-2 text-sm">Cancel</button>
          </div>
        ) : (
          <>
            {post.repostId && (
              <p className="text-sm text-gray-500 mb-1">
                Reposted from{' '}
                <Link href={`/users/${post.repostUserId}`}>{usersMap[post.repostUserId]?.username || 'User'}</Link>
              </p>
            )}
            <p className="mb-2">{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-2 max-w-xs" />}
            <VideoEmbed url={post.videoUrl} />
            <div className="flex gap-2 mt-2">
              <button onClick={likePost} className="bg-pink-500 text-white px-2 py-1 rounded flex items-center gap-1">
                <HeartIcon className="w-5 h-5" />
                <span>({post.likes || 0})</span>
              </button>
              <button onClick={repostPost} className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1">
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span>({post.repostCount || 0})</span>
              </button>
            </div>
            {user && user.id === post.userId && (
              <div className="mt-2 space-x-2 text-sm">
                <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/posts', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id })
                    })
                    if (res.ok) router.push('/profile')
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
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
              <Link href={`/thread/${c.id}`} className="text-blue-600 text-sm inline-flex items-center">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {user && (
        <form onSubmit={addComment} className="mt-4 flex gap-2">
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            rows="3"
            placeholder="Write a comment..."
            className="border p-2 flex-grow rounded resize-none focus:outline-none bg-white"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 rounded">Add</button>
        </form>
      )}
    </div>
  )
}
