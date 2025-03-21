"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, LoadScript, Marker, Polyline, Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

interface ITrip {
  _id: string;
  from: string;
  to: string;
  distance: number;
  mode: string;
  emissions: number;
  date: string;
  fromCoordinates: { lat: number; lng: number };
  toCoordinates: { lat: number; lng: number };
}

export default function TravelPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("history");
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distance, setDistance] = useState("");
  const [mode, setMode] = useState("Car");
  const [travelHistory, setTravelHistory] = useState<ITrip[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 });
  const [loading, setLoading] = useState(false);

  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Fetch travel history from MongoDB
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips");
        setTravelHistory(response.data.trips);
      } catch (error) {
        console.error("Error fetching travel history:", error);
      }
    };

    fetchTrips();
  }, []);

  // Handle place selection from Google Maps Autocomplete
  const handlePlaceSelect = (ref: React.MutableRefObject<google.maps.places.Autocomplete | null>, setPlace: (place: string) => void) => {
    if (ref.current) {
      const place = ref.current.getPlace();
      if (place?.formatted_address) {
        setPlace(place.formatted_address);
      }
    }
  };

  const calculateDistance = async () => {
    if (!fromPlace || !toPlace) {
      toast({ title: "Error", description: "Please enter both locations", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Get coordinates for both locations
      const geocode = async (address: string) => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: { address, key: GOOGLE_MAPS_API_KEY },
        });

        if (response.data.results.length > 0) {
          return response.data.results[0].geometry.location;
        }
        return null;
      };

      const fromCoordinates = await geocode(fromPlace);
      const toCoordinates = await geocode(toPlace);

      if (!fromCoordinates || !toCoordinates) {
        toast({ title: "Error", description: "Could not fetch coordinates", variant: "destructive" });
        return;
      }

      // Fetch distance using Google Distance Matrix API
      const response = await axios.get("/api/distance", {
        params: { from: fromPlace, to: toPlace },
      });

      if (response.data?.rows?.[0]?.elements?.[0]?.distance) {
        const distanceValue = parseFloat(response.data.rows[0].elements[0].distance.text.replace(" km", ""));
        setDistance(distanceValue.toString());

        // Store trip in MongoDB
        const tripResponse = await axios.post("/api/trips", {
          from: fromPlace,
          to: toPlace,
          distance: distanceValue,
          mode,
          fromCoordinates,
          toCoordinates,
        });

        setTravelHistory((prev) => [tripResponse.data.trip, ...prev]);
        setMapCenter(fromCoordinates);

        toast({ title: "Trip saved!", description: `Your ${mode} trip has been recorded.` });
      } else {
        toast({ title: "Error", description: "Unexpected response from distance API", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      toast({ title: "Error", description: "Failed to calculate distance", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Travel Tracking</h1>

      <Tabs defaultValue="history" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">Travel History</TabsTrigger>
          <TabsTrigger value="add">Add Trip</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Travel Map</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                <GoogleMap mapContainerStyle={{ height: "400px", width: "100%" }} center={mapCenter} zoom={10}>
                  {travelHistory.map((trip) => (
                    <>
                      {/* Start Location Marker */}
                      <Marker key={`${trip._id}-from`} position={trip.fromCoordinates} label="A" />
                      
                      {/* End Location Marker */}
                      <Marker key={`${trip._id}-to`} position={trip.toCoordinates} label="B" />
                      
                      {/* Line Between Locations */}
                      <Polyline
                        path={[trip.fromCoordinates, trip.toCoordinates]}
                        options={{
                          strokeColor: "#ff0000",
                          strokeOpacity: 0.8,
                          strokeWeight: 4,
                        }}
                      />
                    </>
                  ))}
                </GoogleMap>
              </LoadScript>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Recent Trips</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {travelHistory.map((trip) => (
                   <div key={trip._id} className="flex items-center justify-between border p-4 rounded-lg">
                     <div>
                       <h3 className="font-medium">{trip.from} to {trip.to}</h3>
                       <p className="text-sm text-muted-foreground">{trip.date} • {trip.distance} km • {trip.mode}</p>
                     </div>
                     <p className="font-medium">{trip.emissions} kg CO₂e</p>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                <form className="space-y-4">
                  <Label>From</Label>
                  <Autocomplete onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(fromAutocompleteRef, setFromPlace)}>
                    <Input value={fromPlace} onChange={(e) => setFromPlace(e.target.value)} placeholder="Starting location" />
                  </Autocomplete>

                  <Label>To</Label>
                  <Autocomplete onLoad={(autocomplete) => (toAutocompleteRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(toAutocompleteRef, setToPlace)}>
                    <Input value={toPlace} onChange={(e) => setToPlace(e.target.value)} placeholder="Destination" />
                  </Autocomplete>

                  <Label>Mode of Transport</Label>
                  <select value={mode} onChange={(e) => setMode(e.target.value)} className="border p-2 rounded w-full">
                    <option value="Car">🚗 Car</option>
                    <option value="Bus">🚌 Bus</option>
                    <option value="Train">🚆 Train</option>
                    <option value="Airplane">✈️ Airplane</option>
                    <option value="Cycle">🚲 Cycle</option>
                    <option value="Walk">🚶 Walk</option>
                  </select>

                  <Button type="button" onClick={calculateDistance} disabled={loading}>
                    {loading ? "Calculating..." : "Calculate Distance"}
                  </Button>
                  {distance && <p className="text-sm text-muted-foreground">Calculated Distance: {distance} km</p>}

                </form>
              </LoadScript>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

