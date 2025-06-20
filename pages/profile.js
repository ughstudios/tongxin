import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data) router.replace('/users/' + data.id)
      })
  }, [router])

  return <p className="mt-4">Loading...</p>
}
