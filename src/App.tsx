// src/App.tsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { IssueBadgeForm } from './components/IssueBadgeForm'

type Badge = {
  id: string
  title: string
  recipient_email: string
  issued_at: string | null
  revoked: boolean | null
}

export default function App() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all badges (newest first)
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

  // Toggle revoked/unrevoked
  const toggleRevoked = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('badges')
      .update({ revoked: !current })
      .eq('id', id)

    if (error) {
      alert(`Update failed: ${error.message}`)
      return
    }
    await load()
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>OpenBadgeCrafter (LIVE)</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Issue and list badges (Supabase).
      </p>

      {/* Issue form */}
      <IssueBadgeForm onCreated={load} />

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && badges.length === 0 && (
        <p>No badges yet. Add one above or in Supabase → Table Editor → badges → Insert Row.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {badges.map((b) => (
