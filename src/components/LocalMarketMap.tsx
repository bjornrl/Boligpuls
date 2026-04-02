'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface LocalReport {
  _id: string
  title: string
  slug: string
  address: string
  excerpt?: string
  location?: { lat: number; lng: number }
}

export default function LocalMarketMap({
  reports,
  highlightedId,
}: {
  reports: LocalReport[]
  highlightedId?: string
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
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
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [10.4, 63.43], // Trondheim sentrum
      zoom: 12,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    reports.forEach((report) => {
      if (!report.location?.lat || !report.location?.lng) return

      const el = document.createElement('div')
      el.style.cssText = `
        width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
        background: #002D32; transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,45,50,0.3); cursor: pointer;
        border: 2px solid #D7B180;
      `

      new maplibregl.Marker({ element: el })
        .setLngLat([report.location.lng, report.location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25, maxWidth: '280px' }).setHTML(`
            <div style="font-family: system-ui, sans-serif; padding: 4px;">
              <h3 style="margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #002D32;">
                ${report.title}
              </h3>
              <p style="margin: 0 0 4px; font-size: 12px; color: #78716C;">
                ${report.address}
              </p>
              ${
                report.excerpt
                  ? `<p style="margin: 0 0 10px; font-size: 13px; color: #44403C; line-height: 1.5;">
                      ${report.excerpt}
                    </p>`
                  : ''
              }
              <a href="/lokalmarkedet/${report.slug}"
                 style="font-size: 13px; font-weight: 600; color: #D7B180; text-decoration: none;">
                Les rapport &rarr;
              </a>
            </div>
          `)
        )
        .addTo(map.current!)
    })

    return () => map.current?.remove()
  }, [reports])

  // Fly to highlighted report
  useEffect(() => {
    if (!highlightedId || !map.current) return
    const report = reports.find((r) => r._id === highlightedId)
    if (report?.location) {
      map.current.flyTo({
        center: [report.location.lng, report.location.lat],
        zoom: 15,
        duration: 1000,
      })
    }
  }, [highlightedId, reports])

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: 480,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #EDEBE8',
      }}
    />
  )
}
