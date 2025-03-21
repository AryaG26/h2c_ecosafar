"use client";

import { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  location: string[];
  link: string;
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Ensure this is in your .env.local file
const PREDICTHQ_API_TOKEN = process.env.NEXT_PUBLIC_PREDICTHQ_API_TOKEN;
const libraries: any = ["places"];

export default function CommunityPage() {
  const [location, setLocation] = useState<string>("");
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setLocation(place.formatted_address);
      }
    }
  };

  const fetchEvents = async () => {
    if (!location) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract latitude and longitude from the selected place
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Call the Next.js API route to fetch events
      const response = await fetch(`/api/events?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      console.log("API Data:", data); // Debugging

      // Map the API response to the Event interface
      setEvents(
        data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
          location: event.location,
          link: event.phq_attendance?.link || "#",
        }))
      );
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      console.error("Error fetching events:", err); // Debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Find Nearby Environmental Events</h1>

      <LoadScript googleMapsApiKey={GOOGLE_API_KEY!} libraries={libraries}>
        <Autocomplete onLoad={(auto) => setAutocomplete(auto)} onPlaceChanged={handlePlaceSelect}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location (e.g., Mumbai)"
            style={{
              padding: "10px",
              width: "300px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </Autocomplete>
      </LoadScript>

      <button
        onClick={fetchEvents}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Find Events"}
      </button>

      {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

      <div>
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{event.title}</h2>
              <p style={{ marginBottom: "5px" }}>
                <strong>Date:</strong> {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Location:</strong> {event.location.join(", ")}
              </p>
              <p style={{ marginBottom: "5px" }}>{event.description}</p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3", textDecoration: "none" }}
              >
                Learn More
              </a>
            </div>
          ))
        ) : (
          <p>No events found. Try another location.</p>
        )}
      </div>
    </div>
  );
}