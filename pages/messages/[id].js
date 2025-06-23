import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'

export default function Conversation() {
  const router = useRouter()
  const { id } = router.query
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [me, setMe] = useState(null)
  const [other, setOther] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (!id) return
    fetch('/api/messages?userId=' + id)
      .then(r => r.json())
      .then(setMessages)
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data) {
          router.replace('/login')
        } else {
          setMe(data)
        }
      })
    fetch('/api/users?id=' + id)
      .then(r => r.json())
      .then(setOther)
  }, [id])

  async function send() {
    if (!content.trim()) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: id, content })
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages([...messages, msg])
      setContent('')
    }
  }

  function startEdit(m) {
    setEditingId(m.id)
    setEditContent(m.content)
  }

  async function saveEdit() {
    const res = await fetch('/api/messages?id=' + editingId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent })
    })
    if (res.ok) {
      const updated = await res.json()
      setMessages(messages.map(ms => (ms.id === updated.id ? updated : ms)))
      setEditingId(null)
      setEditContent('')
    }
  }

  async function remove(id) {
    const res = await fetch('/api/messages?id=' + id, { method: 'DELETE' })
    if (res.ok) setMessages(messages.filter(ms => ms.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Direct Messages</h1>
      <div className="space-y-2 mb-4">
        {messages.map(m => (
          <div key={m.id} className="border p-2 rounded bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Avatar
                url={m.senderId === me?.id ? me?.avatarUrl : other?.avatarUrl}
                size={24}
              />
              <span>{m.senderId === me?.id ? me?.username : other?.username}</span>
              <span>{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            {editingId === m.id ? (
              <div className="flex gap-2">
                <input
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="border p-1 rounded flex-grow bg-white"
                />
                <button onClick={saveEdit} className="bg-blue-500 text-white px-2 rounded">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-300 px-2 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <p>{m.content}</p>
            )}
            {m.senderId === me?.id && editingId !== m.id && (
              <div className="mt-1 space-x-2 text-sm">
                <button onClick={() => startEdit(m)} className="text-blue-500">
                  Edit
                </button>
                <button onClick={() => remove(m.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border p-2 rounded flex-grow bg-white"
        />
        <button onClick={send} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
