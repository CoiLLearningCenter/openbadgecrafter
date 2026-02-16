// src/AppNoJsx.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Badge = {
  id: string
  title: string
  recipient_email: string
  issued_at: string | null
  revoked: boolean | null
}

export default function AppNoJsx() {
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

  const styleMain: React.CSSProperties = { maxWidth: 760, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }
  const styleItem: React.CSSProperties = { border: '1px solid #ddd', borderRadius: 8, padding: 12 }
  const styleRow:  React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }
  const stylePmuted: React.CSSProperties = { color: '#555', marginBottom: 24 }

  return React.createElement(
    'main',
    { style: styleMain },
    React.createElement('h1', { style: { marginBottom: 8 } }, 'OpenBadgeCrafter'),
    React.createElement('p', { style: stylePmuted }, 'Listing badges from Supabase.'),
    loading
      ? React.createElement('p', null, 'Loading…')
      : null,
    !loading && error
      ? React.createElement('p', { style: { color: 'crimson' } }, `Error: ${error}`)
      : null,
    !loading && !error && badges.length === 0
      ? React.createElement('p', null, 'No badges yet. Add one in Supabase → Table Editor → badges → Insert Row.')
      : null,
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
          )
        )
      )
    )
  )
}
