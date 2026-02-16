// src/AppClean.tsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
console.log('App.tsx mounted');
console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL);

type Badge = {
  id: string
  title: string
  recipient_email: string
  issued_at: string | null
  revoked: boolean | null
}

export default function AppClean() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('issued_at', { ascending: false })

      if (error) setError(error.message)
      else setBadges(data ?? [])

      setLoading(false)
    }
    load()
  }, [])

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>OpenBadgeCrafter</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Listing badges from Supabase.
      </p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && badges.length === 0 && (
        <p>No badges yet. Add one in Supabase → Table Editor → badges → Insert Row.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {badges.map((b) => (
          <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <strong>{b.title}</strong>
              <span style={{ fontSize: 12, color: b.revoked ? '#b00020' : '#0d652d' }}>
                {b.revoked ? 'Revoked' : 'Active'}
              </span>
            </div>
            <div style={{ fontSize: 14, color: '#444' }}>
              <div>Recipient: {b.recipient_email}</div>
              <div>Issued: {b.issued_at ? new Date(b.issued_at).toLocaleString() : '—'}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
