// "use client"

// import { useEffect, useRef } from "react"
// import L from "leaflet"
// import "leaflet/dist/leaflet.css"

// export default function MapComponent() {
//   const mapRef = useRef<L.Map | null>(null)

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       if (!mapRef.current) {
//         // Initialize the map
//         mapRef.current = L.map("map").setView([51.505, -0.09], 13)

//         // // Add the tile layer (OpenStreetMap)
//         // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         // }).addTo(mapRef.current)

//         // Add some sample routes
//         const homeCoords = [51.505, -0.09]
//         const workCoords = [51.515, -0.1]
//         const storeCoords = [51.498, -0.08]

//         // Home to work route
//         L.polyline([homeCoords, workCoords], {
//           color: "red",
//           weight: 3,
//           opacity: 0.7,
//         }).addTo(mapRef.current)

//         // Home to store route
//         L.polyline([homeCoords, storeCoords], {
//           color: "green",
//           weight: 3,
//           opacity: 0.7,
//         }).addTo(mapRef.current)

//         // Add markers
//         L.marker(homeCoords).addTo(mapRef.current).bindPopup("Home")

//         L.marker(workCoords).addTo(mapRef.current).bindPopup("Work")

//         L.marker(storeCoords).addTo(mapRef.current).bindPopup("Store")
//       }
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove()
//         mapRef.current = null
//       }
//     }
//   }, [])

//   return <div id="map" className="h-full w-full" />
// }

"use client"

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { useState } from "react"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 19.0760, // Mumbai latitude
  lng: 72.8777, // Mumbai longitude
}

interface MapComponentProps {
  onPlaceSelected?: (location: google.maps.LatLngLiteral) => void
}

export default function MapComponent({ onPlaceSelected }: MapComponentProps) {
  const [markerPosition, setMarkerPosition] = useState(center)

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      setMarkerPosition(newPosition)
      if (onPlaceSelected) {
        onPlaceSelected(newPosition)
      }
    }
  }

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  )
}
