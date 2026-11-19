"use client";
import {
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setWorkerUrl(
      new URL(
        "maplibre-gl/dist/maplibre-gl-worker.mjs",
        import.meta.url,
      ).toString(),
    );

    const map = new Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [10.4, 56.0],
      zoom: 5,
    });
    mapRef.current = map;
    map.addControl(new NavigationControl(), "bottom-right");
    map.addControl(new GeolocateControl({ trackUserLocation: true}), "bottom-right");

    let cancelled = false;

    const onSuccess = (position: GeolocationPosition) => {
      if (cancelled) return;
      const lng = position.coords.longitude;
      const lat = position.coords.latitude;
      map.flyTo({ center: [lng, lat], zoom: 14 });
      const popup = new Popup({ offset: 35 }).setText("You are here :-)");

      new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map)
        .togglePopup();
    };

    const onError = (error: GeolocationPositionError) => {
      console.log("Kunne ikke hente position:", error.message);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div ref={containerRef} className="w-full h-screen" />
    </div>
  );
}
