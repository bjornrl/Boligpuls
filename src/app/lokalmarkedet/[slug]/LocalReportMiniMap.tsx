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

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [lng, lat],
      zoom: 15,
      interactive: false,
    })

    const el = document.createElement('div')
    el.style.cssText = `
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: #002D32; transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,45,50,0.3);
      border: 2px solid #D7B180;
    `

    new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)

    return () => map.remove()
  }, [lat, lng, title])

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: 240,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #EDEBE8',
      }}
    />
  )
}
