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

    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'MQFe5kgRQ60LQYDtjeaf'

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/019d5319-998f-7ec1-bed6-693488cfcbfc/style.json?key=${key}`,
      center: [10.4, 63.43],
      zoom: 12,
      attributionControl: false,
    })

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    )

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    )

    map.current.on('load', () => {
      reports.forEach((report) => {
        if (!report.location?.lat || !report.location?.lng || !map.current) return

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
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 14px;
              line-height: 1;
            ">📍</span>
          </div>
        `

        el.addEventListener('mouseenter', () => {
          const pin = el.firstElementChild as HTMLElement
          if (pin) {
            pin.style.transform = 'rotate(-45deg) scale(1.15)'
            pin.style.boxShadow = '0 6px 20px rgba(0,45,50,0.45)'
          }
        })
        el.addEventListener('mouseleave', () => {
          const pin = el.firstElementChild as HTMLElement
          if (pin) {
            pin.style.transform = 'rotate(-45deg) scale(1)'
            pin.style.boxShadow = '0 3px 12px rgba(0,45,50,0.35)'
          }
        })

        const popup = new maplibregl.Popup({
          offset: [0, -20],
          maxWidth: '300px',
          closeButton: true,
          closeOnClick: false,
        }).setHTML(`
          <div style="
            font-family: 'Basel Grotesk', Arial, sans-serif;
            padding: 6px 2px;
          ">
            <h3 style="
              margin: 0 0 6px;
              font-size: 16px;
              font-weight: 700;
              color: #002D32;
              font-family: 'Basel Classic', Georgia, serif;
              line-height: 1.3;
            ">
              ${report.title}
            </h3>
            <p style="
              margin: 0 0 6px;
              font-size: 12px;
              color: #5F7A7D;
            ">
              ${report.address || ''}
            </p>
            ${report.excerpt ? `
              <p style="
                margin: 0 0 12px;
                font-size: 13px;
                color: #44403C;
                line-height: 1.55;
              ">
                ${report.excerpt.length > 120 ? report.excerpt.substring(0, 120) + '...' : report.excerpt}
              </p>
            ` : ''}
            <a href="/lokalmarkedet/${report.slug}"
               style="
                 display: inline-block;
                 padding: 8px 16px;
                 background: #002D32;
                 color: #D7B180;
                 text-decoration: none;
                 border-radius: 6px;
                 font-size: 13px;
                 font-weight: 600;
               ">
              Les rapport →
            </a>
          </div>
        `)

        new maplibregl.Marker({ element: el })
          .setLngLat([report.location.lng, report.location.lat])
          .setPopup(popup)
          .addTo(map.current!)
      })

      const reportsWithCoords = reports.filter(r => r.location?.lat && r.location?.lng)
      if (reportsWithCoords.length > 1) {
        const bounds = new maplibregl.LngLatBounds()
        reportsWithCoords.forEach(r => {
          bounds.extend([r.location!.lng, r.location!.lat])
        })
        map.current?.fitBounds(bounds, { padding: 60, maxZoom: 14 })
      }
    })

    return () => map.current?.remove()
  }, [reports])

  useEffect(() => {
    if (!highlightedId || !map.current) return
    const report = reports.find((r) => r._id === highlightedId)
    if (report?.location) {
      map.current.flyTo({
        center: [report.location.lng, report.location.lat],
        zoom: 16,
        duration: 1200,
        essential: true,
      })
    }
  }, [highlightedId, reports])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: 500,
          borderRadius: 16,
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
