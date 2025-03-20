"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Car, Train, Plane, Bike } from "lucide-react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Mock travel history data
const travelHistory = [
  {
    id: 1,
    date: "2023-05-15",
    mode: "car",
    distance: 12.5,
    emissions: 2.8,
    from: "Home",
    to: "Office",
    icon: Car,
    coordinates: { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
  },
  {
    id: 2,
    date: "2023-05-14",
    mode: "train",
    distance: 35.2,
    emissions: 1.4,
    from: "Home",
    to: "Downtown",
    icon: Train,
    coordinates: { lat: 19.1076, lng: 72.8365 },
  },
];

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState("history");
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [distance, setDistance] = useState("");
  const { toast } = useToast();
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 });

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Trip added",
      description: "Your trip has been added to your travel history.",
    });
  };

  const calculateDistance = async () => {
    if (fromPlace && toPlace) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
          fromPlace
        )}&destinations=${encodeURIComponent(toPlace)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const distanceValue = response.data.rows[0].elements[0].distance.text;
      setDistance(distanceValue);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Travel Tracking</h1>
      </div>

      <Tabs defaultValue="history" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">Travel History</TabsTrigger>
          <TabsTrigger value="add">Add Trip</TabsTrigger>

        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Travel Map</CardTitle>
              <CardDescription>Visualize your recent trips and their environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ height: "400px", width: "100%" }}
                  center={mapCenter}
                  zoom={10}
                >
                  {travelHistory.map((trip) => (
                    <Marker key={trip.id} position={trip.coordinates} />
                  ))}
                </GoogleMap>
              </LoadScript>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Trips</CardTitle>
              <CardDescription>Your travel history and associated carbon emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {travelHistory.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <trip.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {trip.from} to {trip.to}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {trip.date} • {trip.distance} km • {trip.mode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trip.emissions} kg CO₂e</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.emissions === 0 ? "Carbon neutral" : "Carbon impact"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Trip</CardTitle>
              <CardDescription>Enter the details of your trip to calculate its carbon footprint</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTrip} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                      <Autocomplete
                        onPlaceChanged={() => setFromPlace(document.getElementById("from")?.value || "")}
                      >
                        <Input id="from" placeholder="Starting location" />
                      </Autocomplete>
                    </LoadScript>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                      <Autocomplete
                        onPlaceChanged={() => setToPlace(document.getElementById("to")?.value || "")}
                      >
                        <Input id="to" placeholder="Destination" />
                      </Autocomplete>
                    </LoadScript>
                  </div>
                </div>

                <Button type="button" onClick={calculateDistance}>
                  Calculate Distance
                </Button>

                {distance && (
                  <p className="text-sm text-muted-foreground">Calculated Distance: {distance}</p>
                )}

                <Button type="submit">Add Trip</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
