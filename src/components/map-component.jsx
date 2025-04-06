import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function MapComponent({ incidents }) {
  // Defines default coordinates for Kathmandu to center the map if no incidents exist
  const defaultCenter = [27.6588, 85.3247]
  // Finds first incident with valid coordinates and uses it as map center, falls back to default center if none found
  const mapCenter = incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude)
    ? [incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude).location.latitude,
       incidents.find(incident => incident?.location?.latitude && incident?.location?.longitude).location.longitude]
    : defaultCenter

  return (
    // Creates a map container with 100% width and 500px height, centered on mapCenter coordinates with zoom level 13
    <MapContainer 
      style={{ width: '100%', height: '500px' }}
      center={mapCenter}
      zoom={13}
    >
      // Adds OpenStreetMap tile layer with attribution for map background
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Maps through incidents array and creates markers for each incident with valid coordinates */}
      {incidents.map((incident, index) => (
        // Checks if incident has valid latitude and longitude before creating marker
        incident?.location?.latitude && incident?.location?.longitude ? (
          // Creates a marker at incident location with popup containing incident details
          <Marker 
            key={index}
            position={[incident.location.latitude, incident.location.longitude]}
          >
            {/* Displays incident information in a popup when marker is clicked */}
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

