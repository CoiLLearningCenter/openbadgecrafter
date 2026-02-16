// src/components/IssueBadgeForm.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function IssueBadgeForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('')
  const [recipient, setRecipient] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setOk(false)
    const { error } = await supabase.from('badges').insert([
      { title, recipient_email: recipient }
    ])
    setBusy(false)
    if (error) {
      setError(error.message)
    } else {
      setOk(true)
      setTitle('')
      setRecipient('')
      onCreated?.()
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
      <h2>Issue a Badge</h2>

      <label>
        <div style={{ fontSize: 12, color: '#555' }}>Title</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Lighting Level 1"
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 12, color: '#555' }}>Recipient Email</div>
        <input
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          placeholder="learner@example.com"
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        style={{
          padding: '10px 14px',
          borderRadius: 6,
          border: '1px solid #333',
          background: '#111',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        {busy ? 'Issuing…' : 'Issue Badge'}
      </button>

      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}
      {ok && <div style={{ color: '#0d652d' }}>Badge issued.</div>}
    </form>
  )
}
