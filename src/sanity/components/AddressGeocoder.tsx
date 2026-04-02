'use client'
import { useCallback, useRef, useState } from 'react'
import { set, PatchEvent, type ObjectInputProps } from 'sanity'
import { Stack, Card, Button, Text } from '@sanity/ui'

export function AddressGeocoder(props: ObjectInputProps) {
  const { onChange, value } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<{ lat: string; lon: string; display_name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const objValue = value as { lat?: number; lng?: number } | undefined

  const searchAddress = useCallback(async () => {
    const query = inputRef.current?.value?.trim()
    if (!query) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Trondheim, Norway')}&limit=5`
      const res = await fetch(url)

      if (!res.ok) {
        setError(`Feil fra geocoding-tjeneste: ${res.status}`)
        setLoading(false)
        return
      }

      const data = await res.json()

      if (!data || data.length === 0) {
        setError('Ingen resultater funnet. Prøv en annen adresse.')
        setLoading(false)
        return
      }

      setResults(data)
    } catch (err) {
      console.error('Geocoding failed:', err)
      setError('Kunne ikke koble til geocoding-tjeneste. Sjekk internettforbindelsen.')
    }

    setLoading(false)
  }, [])

  const selectResult = useCallback(
    (result: { lat: string; lon: string; display_name: string }) => {
      // Use path-based patches for each sub-field
      onChange(
        PatchEvent.from([
          set(parseFloat(result.lat), ['lat']),
          set(parseFloat(result.lon), ['lng']),
        ])
      )
      setResults([])
      setError('')
      if (inputRef.current) {
        inputRef.current.value = result.display_name
      }
    },
    [onChange]
  )

  return (
    <Stack space={3}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Søk opp adresse..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              searchAddress()
            }
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: 4,
            outline: 'none',
          }}
        />
        <Button
          text={loading ? 'Søker...' : 'Søk'}
          onClick={searchAddress}
          disabled={loading}
          mode="ghost"
          tone="primary"
        />
      </div>

      {error && (
        <Text size={1} style={{ color: '#b35050' }}>
          {error}
        </Text>
      )}

      {results.length > 0 && (
        <Card padding={2} radius={2} shadow={1}>
          <Stack space={2}>
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(r)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: 13,
                  padding: '8px 10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f3f3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {r.display_name}
              </button>
            ))}
          </Stack>
        </Card>
      )}

      {objValue?.lat && objValue?.lng && (
        <Text size={1} muted>
          Koordinater: {objValue.lat.toFixed(6)}, {objValue.lng.toFixed(6)}
        </Text>
      )}
    </Stack>
  )
}
