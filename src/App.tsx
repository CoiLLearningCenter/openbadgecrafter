// src/App.tsx
import React, { useEffect, useState } from 'react'
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

  const styleMain: React.CSSProperties = { maxWidth: 760, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }
  const stylePmuted: React.CSSProperties = { color: '#555', marginBottom: 24 }
  const styleItem: React.CSSProperties = { border: '1px solid #ddd', borderRadius: 8, padding: 12 }
  const styleRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }

  return React.createElement(
    'main',
    { style: styleMain },
    React.createElement('h1', { style: { marginBottom: 8 } }, 'OpenBadgeCrafter (LIVE)'),
    React.createElement('p', { style: stylePmuted }, 'Issue and list badges (Supabase).'),

    // Issue form
    React.createElement(IssueBadgeForm, { onCreated: load }),

    loading ? React.createElement('p', null, 'Loading…') : null,
    !loading && error ? React.createElement('p', { style: { color: 'crimson' } }, `Error: ${error}`) : null,
    !loading && !error && badges.length === 0
      ? React.createElement('p', null, 'No badges yet. Add one above or in Supabase → Table Editor → badges → Insert Row.')
      : null,

    // List
    React.createElement(
      'ul',
      { style: { listStyle: 'none', padding: 0, display: 'grid', gap: 12 } },
      ...badges.map((b) =>
        React.createElement(
          'li',
          { key: b.id, style: styleItem },
          React.createElement(
            'div',
            { style: styleRow },
            React.createElement('strong', null, b.title),
            React.createElement(
              'span',
              { style: { fontSize: 12, color: b.revoked ? '#b00020' : '#0d652d' } },
              b.revoked ? 'Revoked' : 'Active'
            )
          ),
          React.createElement(
            'div',
            { style: { fontSize: 14, color: '#444' } },
            React.createElement('div', null, `Recipient: ${b.recipient_email}`),
            React.createElement('div', null, `Issued: ${b.issued_at ? new Date(b.issued_at).toLocaleString() : '—'}`)
          ),
          React.createElement(
            'div',
            { style: { marginTop: 10 } },
            React.createElement(
              'button',
              {
                onClick: () => toggleRevoked(b.id, !!b.revoked),
                style: {
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: b.revoked ? '#eee' : '#111',
                  color: b.revoked ? '#111' : '#fff',
                  cursor: 'pointer'
                }
              },
              b.revoked ? 'Unrevoke' : 'Revoke'
            )
          )
        )
      )
    )
  )
}
