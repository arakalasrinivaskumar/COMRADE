import "./LiveTracking.css";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const createLocationIcon = () =>
  L.divIcon({
    className: "comrade-location-icon",
    html: '<div class="comrade-location-dot"><span></span></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

function RecenterMap({ position, recenterSignal }) {
  const map = useMap();

  useEffect(() => {
    if (position && recenterSignal > 0) {
      map.flyTo(position, Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [map, position, recenterSignal]);

  return null;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function LiveTracking() {
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState(
    "Start tracking to share your current location with this map."
  );
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recenterSignal, setRecenterSignal] = useState(0);

  const watchIdRef = useRef(null);
  const startedAtRef = useRef(null);
  const elapsedBeforeRef = useRef(0);
  const lastPositionRef = useRef(null);
  const trackingRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!tracking || paused || startedAtRef.current === null) return;

    const timer = window.setInterval(() => {
      setDuration(
        elapsedBeforeRef.current +
          Math.floor((Date.now() - startedAtRef.current) / 1000)
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [tracking, paused]);

  const stopGPS = () => {
    if (
      watchIdRef.current !== null &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = null;
  };

  const startGPS = () => {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support GPS location.");
      return;
    }

    setMessage("Waiting for GPS location permission…");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (result) => {
        const next = [
          result.coords.latitude,
          result.coords.longitude,
        ];

        setPosition(next);

        if (trackingRef.current && !pausedRef.current) {
          const previous = lastPositionRef.current;

          if (previous) {
            const meters = L.latLng(previous).distanceTo(
              L.latLng(next)
            );

            // Ignore tiny GPS fluctuations.
            if (meters >= 5 && meters < 1000) {
              setDistance((current) => current + meters);
              setRoute((current) => [...current, next]);
              lastPositionRef.current = next;
            } else if (meters >= 1000) {
              // Avoid drawing an unrealistic jump in the route.
              lastPositionRef.current = next;
            }
          } else {
            setRoute((current) => [...current, next]);
            lastPositionRef.current = next;
          }
        }

        setMessage(
          `GPS active · Accuracy approximately ${Math.round(
            result.coords.accuracy
          )} m`
        );
      },
      (error) => {
        const errors = {
          1: "Location permission was denied. Allow location access in your browser settings.",
          2: "Your location is currently unavailable. Try again in an open area.",
          3: "GPS timed out. Please try again.",
        };

        setMessage(errors[error.code] || "Unable to get your location.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      }
    );
  };

  const handleStart = () => {
    if (trackingRef.current) return;

    trackingRef.current = true;
    pausedRef.current = false;
    lastPositionRef.current = null;

    setTracking(true);
    setPaused(false);
    setRoute([]);
    setDistance(0);
    setDuration(0);

    elapsedBeforeRef.current = 0;
    startedAtRef.current = Date.now();

    startGPS();
  };

  const handlePause = () => {
    if (!trackingRef.current || pausedRef.current) return;

    elapsedBeforeRef.current = duration;
    startedAtRef.current = null;
    pausedRef.current = true;

    setPaused(true);
    stopGPS();
    setMessage("Tracking paused. Your route is saved on this page.");
  };

  const handleResume = () => {
    if (!trackingRef.current || !pausedRef.current) return;

    pausedRef.current = false;
    startedAtRef.current = Date.now();

    setPaused(false);
    startGPS();
  };

  const handleStop = () => {
    stopGPS();

    trackingRef.current = false;
    pausedRef.current = false;
    lastPositionRef.current = null;
    startedAtRef.current = null;

    setTracking(false);
    setPaused(false);
    setMessage("Tracking stopped. Your recorded route remains visible.");
  };

  const handleRecenter = () => {
    if (!position) {
      setMessage("Start tracking first to find your current location.");
      return;
    }

    setRecenterSignal((value) => value + 1);
  };

  const center = position || [17.385, 78.4867];

  return (
    <section className="live-tracking-section" id="live-tracking">
      <div className="live-tracking-heading">
        <span className="live-tracking-eyebrow">
          YOUR JOURNEY, YOUR STORY
        </span>

        <h2>Explore with <span>COMRADE.</span></h2>

        <p>
          Find your location, record your route, and keep track
          of your journey as you explore.
        </p>
      </div>

      <div className="tracking-stats">
        <div className="tracking-stat">
          <span>STATUS</span>
          <strong>
            {tracking ? (paused ? "Paused" : "Recording") : "Not started"}
          </strong>
        </div>

        <div className="tracking-stat">
          <span>DISTANCE</span>
          <strong>{(distance / 1000).toFixed(2)} km</strong>
        </div>

        <div className="tracking-stat">
          <span>DURATION</span>
          <strong>{formatDuration(duration)}</strong>
        </div>

        <div className="tracking-stat">
          <span>ROUTE POINTS</span>
          <strong>{route.length}</strong>
        </div>
      </div>

      <div className="tracking-map-shell">
        <div className="tracking-map-toolbar">
          <div>
            <strong>Live map</strong>
            <span>Hyderabad · GPS tracking</span>
          </div>

          <button
            type="button"
            className="tracking-recenter-button"
            onClick={handleRecenter}
          >
            ◎ Recenter
          </button>
        </div>

        <MapContainer
          center={center}
          zoom={position ? 15 : 11}
          scrollWheelZoom
          className="tracking-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap
            position={position}
            recenterSignal={recenterSignal}
          />

          {position && (
            <>
              <Circle
                center={position}
                radius={30}
                pathOptions={{
                  color: "#2588f4",
                  fillColor: "#2588f4",
                  fillOpacity: 0.12,
                }}
              />

              <Marker
                position={position}
                icon={createLocationIcon()}
              />
            </>
          )}

          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#e53b46",
                weight: 5,
                opacity: 0.9,
              }}
            />
          )}
        </MapContainer>

        <div className="tracking-map-note" role="status">
          {message}
        </div>
      </div>

      <div className="tracking-controls">
        {!tracking ? (
          <button
            type="button"
            className="tracking-button tracking-start"
            onClick={handleStart}
          >
            ▶ Start tracking
          </button>
        ) : (
          <>
            {!paused ? (
              <button
                type="button"
                className="tracking-button tracking-pause"
                onClick={handlePause}
              >
                Ⅱ Pause
              </button>
            ) : (
              <button
                type="button"
                className="tracking-button tracking-start"
                onClick={handleResume}
              >
                ▶ Resume
              </button>
            )}

            <button
              type="button"
              className="tracking-button tracking-stop"
              onClick={handleStop}
            >
              ■ Stop
            </button>
          </>
        )}
      </div>

      <p className="tracking-privacy">
        Your browser will ask for location permission before tracking starts.
        This demo keeps the route in the current page; it does not upload
        or permanently save your journey.
      </p>
    </section>
  );
}