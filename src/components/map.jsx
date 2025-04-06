import React from 'react'
import dynamic from 'next/dynamic'

// Only import Leaflet CSS and compatibility files on client-side
const MapWithNoSSR = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
})

// Export wrapped Map component as default export
export default function Map({ incidents }) {
  return <MapWithNoSSR incidents={incidents} />
}

