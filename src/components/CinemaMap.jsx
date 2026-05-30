"use client";

import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";

export function CinemaMap() {
  // Exact coordinates for MaxX Lite 3D Cinema inside K-Zone, Moratuwa
  const cinemaLocation = {
    lng: 79.88765,
    lat: 6.79590
  };

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-[3rem] border border-white/10 bg-black relative z-0">
      <Map 
        initialViewState={{
          longitude: cinemaLocation.lng,
          latitude: cinemaLocation.lat,
          zoom: 20,    // Increased from 18 to 20 for an ultra-close, street-level building look
          pitch: 30,   // Adjusted from 45 to 30 so the text badge/building overlay isn't overly skewed
          bearing: 0
        }}
        theme="dark" 
        className="w-full h-full"
      >
        <MapControls 
          position="bottom-right" 
          showZoom={true} 
          showCompass={true}
        />

        <MapMarker longitude={cinemaLocation.lng} latitude={cinemaLocation.lat}>
          <MarkerContent>
             <div className="relative group">
                <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-black border-2 border-cyan-500 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <span className="text-[10px] font-black uppercase italic text-cyan-400 tracking-tighter whitespace-nowrap">
                    MaxX Lite 3D
                  </span>
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cyan-500 mx-auto" />
             </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}