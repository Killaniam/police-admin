import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

const Map = ({ incidents }) => {
  const defaultCenter = [27.6588, 85.3247] 
  const mapCenter = incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude)
    ? [incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude).location.latitude,
       incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude).location.longitude]
    : defaultCenter

  return (
    <MapContainer 
      style={{ width: '100%', height: '500px' }}
      center={mapCenter}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident, index) => (
        incident?.location?.latitude && incident?.location?.longitude ? (
          <Marker 
            key={index}
            position={[incident.location.latitude, incident.location.longitude]}
          >
            <Popup>
              <h1>{incident.incidentType}</h1>
              <p>{incident.incidentDetails}</p>
              <h2>Submitted By: {incident.submittedBy}</h2>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  )
}

export default Map

