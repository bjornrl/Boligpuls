'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function LocalReportMiniMap({
  lat,
  lng,
  title,
}: {
  lat: number
  lng: number
  title: string
}) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'MQFe5kgRQ60LQYDtjeaf'

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/019d5319-998f-7ec1-bed6-693488cfcbfc/style.json?key=${key}`,
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
    })

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    )

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    )

    const el = document.createElement('div')
    el.innerHTML = `
      <div style="
        width: 36px;
        height: 36px;
        background: #002D32;
        border: 2.5px solid #D7B180;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 12px rgba(0,45,50,0.35);
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 14px;
          line-height: 1;
        ">📍</span>
      </div>
    `

    new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)

    return () => map.remove()
  }, [lat, lng, title])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: 240,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #D4DCDE',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        fontSize: 10,
        color: '#9BAFB2',
      }}>
        © <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener" style={{ color: '#9BAFB2' }}>MapTiler</a>
        {' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" style={{ color: '#9BAFB2' }}>© OpenStreetMap</a>
      </div>
    </div>
  )
}
