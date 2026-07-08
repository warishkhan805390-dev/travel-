import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapView({ latitude, longitude, address, height = '400px', zoom = 14 }) {
  if (!latitude || !longitude) {
    return (
      <div
        className="rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">Map location not available</p>
      </div>
    )
  }

  const position = [latitude, longitude]

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{address || 'Location'}</p>
              <p className="text-gray-500 text-xs mt-1">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
