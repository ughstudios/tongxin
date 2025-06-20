import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Conversation() {
  const router = useRouter()
  const { id } = router.query
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!id) return
    fetch('/api/messages?userId=' + id)
      .then(r => r.json())
      .then(setMessages)
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Direct Messages</h1>
      <div className="space-y-2 mb-4">
        {messages.map(m => (
          <div key={m.id} className="border p-2 rounded">
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button onClick={send} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
