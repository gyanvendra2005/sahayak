"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// 🔹 Utility: create custom styled emoji icon
const createCategoryIcon = (emoji: string, bg: string) =>
  L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        font-size: 28px; 
        font-weight: bold; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: 50px; 
        height: 50px; 
        border-radius: 50%; 
        background: ${bg};
        color: black;
        text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
        border: 2px solid black;
      ">
        ${emoji}
      </div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 50], // center bottom
    popupAnchor: [0, -50],
  });

// 🔹 Category-wise icons
const categoryIcons: Record<string, L.DivIcon> = {
  potholes: createCategoryIcon("🕳️", "#9ca3af"), // gray
  garbage: createCategoryIcon("🗑️", "#22c55e"), // green
  streetlight: createCategoryIcon("💡", "#facc15"), // yellow
  water: createCategoryIcon("💧", "#3b82f6"), // blue
  other: createCategoryIcon("📋", "#d1d5db"), // light gray
};

interface Issue {
  id: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
}

interface MapProps {
  issues: Issue[];
}

export default function IssuesMap({ issues }: MapProps) {
  const defaultCenter =
    issues.length > 0 && [issues[0]?.lat , issues[0]?.lng]
     

  useEffect(() => {
    console.log("📍 Issues Marked on Map:", issues);
  }, [issues]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter as [number, number]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.lat, issue.lng]}
            icon={categoryIcons[issue.category] || categoryIcons["other"]}
          >
            <Popup>
              <b>{issue.category.toUpperCase()}</b> <br />
              {issue.description} <br />
              📍 {issue.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
