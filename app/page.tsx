"use client";
import { Map, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(0);
  const  [lat, setLat] = useState(0);

 

  setWorkerUrl(
    new URL(
      "maplibre-gl/dist/maplibre-gl-worker.mjs",
      import.meta.url,
    ).toString(),
  );
  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    import("maplibre-gl").then((maplibregl) => {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [long, lat],
        zoom: 5,
        latitude: lat,
        longtitude: long,
      });
      const marker = new maplibregl.Marker().setLngLat([long, lat]).addTo(map);
    });
     const successCallback = (position) => {
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
  };

  const errorCallback = (error) => {
    console.log(error);
  };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [long, lat]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div ref={containerRef} className="w-full h-screen" />
    </div>
  );
}
