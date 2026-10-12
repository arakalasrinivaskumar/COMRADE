import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MemoryTracking.css";

const DB_NAME = "comrade-memory-db";
const DB_VERSION = 2;
const MEMORY_STORE = "memories";
const LOCATION_STORE = "locations";
const TRIP_STORE = "trips";
const DEFAULT_CENTER = [17.385, 78.4867];

const liveIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #4285f4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 8px rgba(66,133,244,0.2),
                  0 1px 6px rgba(0,0,0,0.35);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
const memoryIcon = L.divIcon({
  className: "ct-memory-icon",
  html: '<div class="ct-memory-pin">📍</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -30],
});
const selectedIcon = L.divIcon({
  className: "ct-memory-icon",
  html: '<div class="ct-memory-pin">📌</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -30],
});

function openDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support IndexedDB."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEMORY_STORE)) db.createObjectStore(MEMORY_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(LOCATION_STORE)) db.createObjectStore(LOCATION_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(TRIP_STORE)) db.createObjectStore(TRIP_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}
async function putRecord(storeName, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(record);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error("Save cancelled.")); };
  });
}
async function deleteRecord(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error("Delete cancelled.")); };
  });
}
function MapController({ target, recenterSignal }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    const timer = window.setTimeout(() => {
      map.invalidateSize();
      map.flyTo(target, Math.max(map.getZoom(), 13), { animate: true, duration: 0.8 });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [map, target, recenterSignal]);
  return null;
}
function MapClickPicker({ enabled, onPick }) {
  useMapEvents({ click(event) { if (enabled) onPick([event.latlng.lat, event.latlng.lng]); } });
  return null;
}
function formatDuration(totalSeconds) {
  const n = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(n / 3600);
  const minutes = Math.floor((n % 3600) / 60);
  const seconds = n % 60;
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, "0")).join(":");
}
function validCoords(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export default function MemoryTracking({ selectedPlace }) {
  const [memories, setMemories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [story, setStory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [savingMemory, setSavingMemory] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [pickMode, setPickMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [mapMenuOpen, setMapMenuOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState("Press Start tracking to begin recording your route.");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const lastDiscoverPlaceRef = useRef(null);

useEffect(() => {
  if (!selectedPlace) return;

  const lat = Number(selectedPlace.lat);
  const lng = Number(selectedPlace.lon);

  if (!validCoords(lat, lng)) return;

  const placeKey = `${lat},${lng}`;

  if (lastDiscoverPlaceRef.current === placeKey) return;

  lastDiscoverPlaceRef.current = placeKey;

  setSelectedPoint(null);
  setSelectedMemory(null);
  setPendingPoint(null);
  setRecenterSignal((value) => value + 1);
  setTrackingMessage(
    `Showing ${selectedPlace.name || "selected place"} from Discover on your map.`
  );
}, [selectedPlace]);
  const watchIdRef = useRef(null);
  const startedAtRef = useRef(null);
  const elapsedBeforeRef = useRef(0);
  const lastPositionRef = useRef(null);
  const trackingRef = useRef(false);
  const pausedRef = useRef(false);

  const reloadData = useCallback(async () => {
    setLoading(true);
    try {
      const [savedMemories, savedLocations, savedTrips] = await Promise.all([
        getAll(MEMORY_STORE), getAll(LOCATION_STORE), getAll(TRIP_STORE),
      ]);
      setMemories(savedMemories); setLocations(savedLocations); setTrips(savedTrips);
    } catch (e) {
      console.error("Unable to load COMRADE travel data:", e);
      setError("Couldn't load saved data. Please check this website's browser storage.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { reloadData(); }, [reloadData]);

  useEffect(() => {
    if (!photo) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const photoUrls = useMemo(() => {
    const urls = new Map();
    memories.forEach((m) => { if (m.photo instanceof Blob) urls.set(m.id, URL.createObjectURL(m.photo)); });
    return urls;
  }, [memories]);
  useEffect(() => () => photoUrls.forEach((url) => URL.revokeObjectURL(url)), [photoUrls]);

  const mappedMemories = useMemo(() => memories.filter((m) => validCoords(m.latitude, m.longitude)), [memories]);
  const mapTarget = selectedPlace
  ? [Number(selectedPlace.lat), Number(selectedPlace.lon)]
  : selectedPoint
    ? [selectedPoint.latitude, selectedPoint.longitude]
    : selectedMemory &&
        validCoords(selectedMemory.latitude, selectedMemory.longitude)
      ? [selectedMemory.latitude, selectedMemory.longitude]
      : position || pendingPoint || null;  const mapCenter = mapTarget || (locations.length ? [locations[0].latitude, locations[0].longitude]
    : mappedMemories.length ? [mappedMemories[0].latitude, mappedMemories[0].longitude] : DEFAULT_CENTER);

  const stopGPS = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }, []);
  useEffect(() => () => stopGPS(), [stopGPS]);

  useEffect(() => {
    if (!tracking || paused || startedAtRef.current === null) return undefined;
    const timer = window.setInterval(() => setDuration(elapsedBeforeRef.current + Math.floor((Date.now() - startedAtRef.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [tracking, paused]);

  const startGPS = useCallback(() => {
    if (!navigator.geolocation) { setTrackingMessage("Your browser does not support GPS location."); return; }
    stopGPS();
    setTrackingMessage("Waiting for GPS permission…");
    watchIdRef.current = navigator.geolocation.watchPosition((result) => {
      const next = [result.coords.latitude, result.coords.longitude];
      setPosition(next);
      if (trackingRef.current && !pausedRef.current) {
        const previous = lastPositionRef.current;
        if (!previous) { setRoute((current) => [...current, next]); lastPositionRef.current = next; }
        else {
          const meters = L.latLng(previous).distanceTo(L.latLng(next));
          if (meters >= 5 && meters < 1000) {
            setDistance((current) => current + meters); setRoute((current) => [...current, next]); lastPositionRef.current = next;
          } else if (meters >= 1000) lastPositionRef.current = next;
        }
      }
      setTrackingMessage(`GPS active · Accuracy approximately ${Math.round(result.coords.accuracy)} m`);
    }, (e) => {
      const messages = {
        1: "Location permission denied. Allow location access in your browser settings.",
        2: "Your location is unavailable. Try again in an open area.",
        3: "GPS timed out. Please try again.",
      };
      setTrackingMessage(messages[e.code] || "Unable to get your location.");
    }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 });
  }, [stopGPS]);

  const handleStartTracking = () => {
    if (trackingRef.current) return;
    trackingRef.current = true; pausedRef.current = false; lastPositionRef.current = null;
    setTracking(true); setPaused(false); setRoute([]); setDistance(0); setDuration(0);
    elapsedBeforeRef.current = 0; startedAtRef.current = Date.now(); startGPS();
  };
  const handlePauseTracking = () => {
    if (!trackingRef.current || pausedRef.current) return;
    if (startedAtRef.current !== null) elapsedBeforeRef.current += Math.floor((Date.now() - startedAtRef.current) / 1000);
    startedAtRef.current = null; setDuration(elapsedBeforeRef.current);
    pausedRef.current = true; setPaused(true); stopGPS(); setTrackingMessage("Tracking paused. Your route remains visible.");
  };
  const handleResumeTracking = () => {
    if (!trackingRef.current || !pausedRef.current) return;
    pausedRef.current = false; startedAtRef.current = Date.now(); setPaused(false); startGPS();
  };
  const handleStopTracking = async () => {
    stopGPS();
    if (startedAtRef.current !== null) elapsedBeforeRef.current += Math.floor((Date.now() - startedAtRef.current) / 1000);
    const finalDuration = elapsedBeforeRef.current;
    trackingRef.current = false; pausedRef.current = false; lastPositionRef.current = null; startedAtRef.current = null;
    setTracking(false); setPaused(false); setDuration(finalDuration); setTrackingMessage("Tracking stopped.");
    const routeSnapshot = route.map((p) => [p[0], p[1]]);
    if (routeSnapshot.length < 1) {
      setTrackingMessage("Tracking stopped, but GPS did not record a starting location. Allow location access and try again."); return;
    }
    const trip = {
      id: crypto.randomUUID(), name: `Journey ${new Date().toLocaleString()}`, route: routeSnapshot,
      distanceMeters: Math.round(distance), durationSeconds: finalDuration, createdAt: Date.now(), date: new Date().toLocaleString(),
    };
    try {
      await putRecord(TRIP_STORE, trip); setTrips((current) => [trip, ...current]); setSelectedTrip(trip);
      setTrackingMessage("Journey saved successfully! You can reopen it from Journey History.");
    } catch (e) {
      console.error("Unable to save journey:", e); setError("The journey couldn't be saved. Please check browser storage.");
    }
  };

const handleUseLocation = () => {
  console.log("GPS button clicked");
  setError("");
  setLocationStatus("📍 Requesting your current location...");

  if (!navigator.geolocation) {
    setLocationStatus("❌ Your browser does not support GPS.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      console.log("GPS coordinates:", lat, lng);

      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
      setPendingPoint([lat, lng]);
      setPosition([lat, lng]);
      setLocationName((current) => current || "My saved place");
      setLocationStatus("✅ Location found! Showing your blue dot.");
      setRecenterSignal((value) => value + 1);
    },
    (err) => {
      console.error("GPS error:", err);

      if (err.code === 1) {
        setLocationStatus(
          "❌ Location permission denied. Allow location access in your browser."
        );
      } else if (err.code === 2) {
        setLocationStatus(
          "❌ Your location is unavailable. Check your device location settings."
        );
      } else if (err.code === 3) {
        setLocationStatus(
          "❌ Location request timed out. Please try again."
        );
      } else {
        setLocationStatus("❌ Unable to get your current location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};
  const handleMapPick = (point) => {
    setPendingPoint(point); setSelectedPoint(null); setSelectedMemory(null); setLocationName(""); setPickMode(false);
    setTrackingMessage(`Map point selected: ${point[0].toFixed(5)}, ${point[1].toFixed(5)}. Name it and save.`);
  };
  const handleSaveLocation = async (event) => {
    event.preventDefault();
    if (!pendingPoint || !locationName.trim()) { setError("Select a point on the map or use your GPS, then enter a location name."); return; }
    setSavingLocation(true); setError("");
    const location = {
      id: crypto.randomUUID(), name: locationName.trim(), latitude: pendingPoint[0], longitude: pendingPoint[1],
      createdAt: Date.now(), date: new Date().toLocaleString(),
    };
    try {
      await putRecord(LOCATION_STORE, location); setLocations((current) => [location, ...current]);
      setSelectedPoint(location); setLocationName(""); setPendingPoint(null); setTrackingMessage("Location saved! It will remain available in this browser.");
    } catch (e) {
      console.error("Unable to save location:", e); setError("Couldn't save this location. Please check browser storage.");
    } finally { setSavingLocation(false); }
  };
  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Delete this saved location?")) return;
    try {
      await deleteRecord(LOCATION_STORE, id); setLocations((current) => current.filter((x) => x.id !== id));
      if (selectedPoint?.id === id) setSelectedPoint(null);
    } catch (e) { setError("Couldn't delete this location."); }
  };
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) { setPhoto(null); return; }
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); event.target.value = ""; setPhoto(null); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Please choose an image smaller than 10 MB."); event.target.value = ""; setPhoto(null); return; }
    setError(""); setPhoto(file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); setError("");
    if (!title.trim() || !place.trim() || !story.trim()) { setError("Please fill in your title, place, and story."); return; }
    const hasLat = latitude.trim() !== ""; const hasLng = longitude.trim() !== "";
    if (hasLat !== hasLng) { setError("Enter both coordinates, or leave both empty."); return; }
    let lat = null; let lng = null;
    if (hasLat && hasLng) {
      lat = Number(latitude); lng = Number(longitude);
      if (!validCoords(lat, lng)) { setError("Invalid coordinates. Check latitude and longitude."); return; }
    }
    setSavingMemory(true);
    try {
      const memory = {
        id: crypto.randomUUID(), title: title.trim(), place: place.trim(), story: story.trim(),
        photo, latitude: lat, longitude: lng, date: new Date().toLocaleDateString(), createdAt: Date.now(),
      };
      await putRecord(MEMORY_STORE, memory); setMemories((current) => [memory, ...current]); setSelectedMemory(memory);
      setTitle(""); setPlace(""); setStory(""); setPhoto(null); setLatitude(""); setLongitude(""); setLocationStatus(""); event.target.reset();
    } catch (e) {
      console.error("Unable to save memory:", e); setError("Couldn't save this memory. Your browser storage may be full or unavailable.");
    } finally { setSavingMemory(false); }
  };
  const handleDeleteMemory = async (id) => {
    if (!window.confirm("Delete this memory and its saved photo?")) return;
    try {
      await deleteRecord(MEMORY_STORE, id); setMemories((current) => current.filter((m) => m.id !== id));
      setSelectedMemory((current) => current?.id === id ? null : current);
    } catch (e) { setError("Couldn't delete this memory. Please try again."); }
  };
  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Delete this saved journey?")) return;
    try {
      await deleteRecord(TRIP_STORE, id); setTrips((current) => current.filter((t) => t.id !== id));
      if (selectedTrip?.id === id) { setSelectedTrip(null); setRoute([]); }
    } catch (e) { setError("Couldn't delete this journey."); }
  };
  const showTrip = (trip) => {
    setSelectedTrip(trip); setRoute(trip.route || []); setDistance(trip.distanceMeters || 0); setDuration(trip.durationSeconds || 0);
    if (trip.route?.length) {
      setSelectedPoint(null); setSelectedMemory(null); setPosition(trip.route[trip.route.length - 1]); setRecenterSignal((v) => v + 1);
    }
    document.getElementById("memory-tracking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const runMapMenuAction = (action) => {
    setMapMenuOpen(false);
    if (action === "save-location") {
      setPickMode(true); setTrackingMessage("Click anywhere on the map to choose a location, then name and save it.");
      document.getElementById("memory-tracking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action === "add-memory") {
      document.getElementById("mt-title")?.focus(); document.querySelector(".mt-memory-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action === "tracking") {
      if (!tracking) handleStartTracking();
      else setTrackingMessage(paused ? "Tracking is paused. Use Resume to continue recording." : "Tracking is already active.");
      document.querySelector(".mt-tracking-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (action === "journeys") {
      document.querySelector(".mt-journey-history")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (action === "locations") {
      document.querySelector(".mt-saved-locations")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (action === "my-location") handleUseLocation();
  };
  useEffect(() => {
    if (!mapMenuOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setMapMenuOpen(false); };
    const closeOnOutsideClick = (event) => { if (!event.target.closest(".mt-map-menu")) setMapMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape); document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => { document.removeEventListener("keydown", closeOnEscape); document.removeEventListener("pointerdown", closeOnOutsideClick); };
  }, [mapMenuOpen]);
  const handleRecenter = () => {
    const target = selectedPoint ? [selectedPoint.latitude, selectedPoint.longitude]
      : selectedMemory && validCoords(selectedMemory.latitude, selectedMemory.longitude) ? [selectedMemory.latitude, selectedMemory.longitude] : position;
    if (!target) { setTrackingMessage("Use your current location or select a saved place first."); return; }
    setRecenterSignal((v) => v + 1);
  };

  return (
    <section className="memory-tracking-section" id="memory-tracking">
      <style>{`
        .mt-map-menu { position:relative; flex:0 0 auto; z-index:1000; }
        .mt-map-menu-trigger { display:grid; place-items:center; width:44px; height:44px; border:1px solid #e1e8e5; border-radius:14px; background:#fff; color:#203b34; font-size:28px; line-height:1; cursor:pointer; box-shadow:0 5px 18px rgba(25,55,45,.09); }
        .mt-map-menu-trigger:hover, .mt-map-menu-trigger:focus-visible { background:#f0f7f4; outline:2px solid #16856b; outline-offset:2px; }
        .mt-map-menu-dropdown { position:absolute; top:calc(100% + 8px); right:0; width:min(290px, calc(100vw - 40px)); padding:7px; border:1px solid #e3eae7; border-radius:16px; background:#fff; box-shadow:0 18px 45px rgba(21,46,38,.18); z-index:1200; }
        .mt-map-menu-dropdown button { display:flex; align-items:center; gap:12px; width:100%; min-height:52px; padding:9px 10px; border:0; border-radius:10px; background:transparent; text-align:left; color:#203b34; cursor:pointer; }
        .mt-map-menu-dropdown button:hover, .mt-map-menu-dropdown button:focus-visible { background:#f0f7f4; outline:none; }
        .mt-map-menu-dropdown button > span:first-child { display:grid; place-items:center; flex:0 0 34px; width:34px; height:34px; border-radius:10px; background:#eef6f2; font-size:17px; }
        .mt-map-menu-dropdown button > span:last-child { display:flex; flex-direction:column; gap:2px; min-width:0; }
        .mt-map-menu-dropdown strong { font-size:13px; font-weight:650; }
        .mt-map-menu-dropdown small { color:#718079; font-size:11px; }
      `}</style>
      <div className="mt-container">
        <header className="mt-heading">
          <span className="mt-eyebrow">YOUR JOURNEY, YOUR STORY</span>
          <h2>Explore with <span>COMRADE.</span></h2>
          <p>Save places, track journeys live, and keep your travel memories together on one map.</p>
        </header>
        <div className="mt-stats" aria-label="Journey tracking statistics">
          <div className="mt-stat"><span className="mt-stat-icon">◉</span><div><small>TRACKING</small><strong>{tracking ? (paused ? "Paused" : "Live") : "Not started"}</strong></div></div>
          <div className="mt-stat"><span className="mt-stat-icon">↗</span><div><small>DISTANCE</small><strong>{(distance / 1000).toFixed(2)} km</strong></div></div>
          <div className="mt-stat"><span className="mt-stat-icon">◷</span><div><small>DURATION</small><strong>{formatDuration(duration)}</strong></div></div>
          <div className="mt-stat"><span className="mt-stat-icon">⌖</span><div><small>MEMORIES</small><strong>{memories.length} saved</strong></div></div>
        </div>

        <div className="mt-content-grid">
          <div className="mt-map-card">
            <div className="mt-map-topline">
              <div><span className="mt-live-indicator" /> <strong>Your journey map</strong><p>Live GPS, saved places, memories and recorded routes</p></div>
              <div className="mt-map-menu">
                <button type="button" className="mt-map-menu-trigger" aria-label="Open map options" aria-haspopup="menu" aria-expanded={mapMenuOpen} onClick={() => setMapMenuOpen((open) => !open)}>⋮</button>
                {mapMenuOpen && <div className="mt-map-menu-dropdown" role="menu" aria-label="Map options">
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("save-location")}><span>📍</span><span><strong>Save a location</strong><small>Choose a point on the map</small></span></button>
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("add-memory")}><span>✦</span><span><strong>Add a memory</strong><small>Save a story or photo</small></span></button>
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("tracking")}><span>🧭</span><span><strong>{tracking ? (paused ? "Tracking paused" : "Tracking active") : "Start tracking"}</strong><small>{tracking ? "Go to tracking controls" : "Record a journey"}</small></span></button>
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("journeys")}><span>🛣️</span><span><strong>Journey history</strong><small>{trips.length} saved {trips.length === 1 ? "journey" : "journeys"}</small></span></button>
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("locations")}><span>🔖</span><span><strong>Saved locations</strong><small>{locations.length} bookmarked {locations.length === 1 ? "place" : "places"}</small></span></button>
                  <button type="button" role="menuitem" onClick={() => runMapMenuAction("my-location")}><span>⌖</span><span><strong>My current location</strong><small>Find your GPS position</small></span></button>
                  <button type="button" role="menuitem" onClick={() => { setMapMenuOpen(false); handleRecenter(); }}><span>◎</span><span><strong>Recenter map</strong><small>Focus the selected place</small></span></button>
                </div>}
              </div>
            </div>
            <div className="mt-map-shell">
              <MapContainer center={mapCenter} zoom={position ? 15 : 5} scrollWheelZoom className="mt-map">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController target={mapTarget} recenterSignal={recenterSignal} />
                <MapClickPicker enabled={pickMode} onPick={handleMapPick} />
               {position && (
  <>
    <Circle
      center={position}
      radius={35}
      pathOptions={{
        color: "#4285F4",
        fillColor: "#4285F4",
        fillOpacity: 0.12,
        weight: 1,
      }}
    />

    <Marker position={position} icon={liveIcon}>
      <Popup>
        <strong>🔵 Your current location</strong>
        <br />
        Your latest GPS position
      </Popup>
    </Marker>
  </>
)}
                {route.length > 1 && <Polyline positions={route} pathOptions={{ color: "#ef8b3d", weight: 5, opacity: 0.9 }} />}
                {pendingPoint && <Marker position={pendingPoint} icon={selectedIcon}><Popup><strong>Selected location</strong><br />{pendingPoint[0].toFixed(5)}, {pendingPoint[1].toFixed(5)}<br />Use the form to save it.</Popup></Marker>}
                {locations.map((loc) => <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={memoryIcon} eventHandlers={{ click: () => setSelectedPoint(loc) }}><Popup><strong>{loc.name}</strong><br /><small>{loc.date}</small><br /><button type="button" onClick={() => { setSelectedPoint(loc); setRecenterSignal((v) => v + 1); }}>View this place</button></Popup></Marker>)}
                {mappedMemories.map((memory) => <Marker key={memory.id} position={[memory.latitude, memory.longitude]} icon={memoryIcon} eventHandlers={{ click: () => setSelectedMemory(memory) }}><Popup><div className="mt-popup">{photoUrls.get(memory.id) && <img src={photoUrls.get(memory.id)} alt={memory.title} />}<strong>{memory.title}</strong><span>{memory.place}</span><p>{memory.story}</p><small>{memory.date}</small></div></Popup></Marker>)}
              </MapContainer>
            </div>
            <div className="mt-map-legend"><span><i className="mt-legend-live" /> Live location</span><span><i className="mt-legend-route" /> Recorded route</span><span><i className="mt-legend-memory">📍</i> Saved place / memory</span></div>
            <div className="mt-tracking-panel">
              <p className="mt-status-message" role="status">{trackingMessage}</p>
              <div className="mt-controls">
                {!tracking && <button type="button" className="mt-button mt-primary" onClick={handleStartTracking}>▶ Start tracking</button>}
                {tracking && !paused && <button type="button" className="mt-button mt-primary" onClick={handlePauseTracking}>Ⅱ Pause</button>}
                {tracking && paused && <button type="button" className="mt-button mt-primary" onClick={handleResumeTracking}>▶ Resume</button>}
                {tracking && <button type="button" className="mt-button mt-secondary" onClick={handleStopTracking}>■ Stop & save journey</button>}
                <button type="button" className="mt-button mt-outline" onClick={handleUseLocation}>⌖ Use current GPS location</button>
                <button type="button" className={`mt-button ${pickMode ? "mt-secondary" : "mt-outline"}`} onClick={() => { setPickMode((v) => !v); setTrackingMessage(!pickMode ? "Click anywhere on the map to select a place." : "Map selection cancelled."); }}>{pickMode ? "Cancel map selection" : "＋ Choose on map"}</button>
              </div>
              <p className="mt-privacy">🔒 Memories, saved places and journeys are stored locally in this browser. They are not uploaded to an account.</p>
            </div>
          </div>

          <form className="mt-form mt-memory-form" onSubmit={handleSubmit}>
            <div className="mt-form-heading"><span>✦</span><div><h3>Save a memory</h3><p>Keep the moments that matter.</p></div></div>
            {error && <p className="mt-error" role="alert">{error}</p>}
            <label htmlFor="mt-title">Memory title</label>
            <input id="mt-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A beautiful evening..." maxLength={80} required />
            <label htmlFor="mt-place">Where was it?</label>
            <input id="mt-place" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Goa, India" maxLength={120} required />
            <label htmlFor="mt-story">Your story</label>
            <textarea id="mt-story" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Write about this special moment..." rows={4} maxLength={1000} required />
            <div className="mt-location-heading"><label htmlFor="mt-latitude">📍 Pin your location (optional)</label><button type="button" className="mt-location-button" onClick={handleUseLocation}>Use my current location</button></div>
            <p className="mt-help">GPS is used only when you click the button and grant permission. You can also enter coordinates manually.</p>
            <div className="mt-coordinate-fields"><div><label htmlFor="mt-latitude">Latitude</label><input id="mt-latitude" type="number" step="any" min="-90" max="90" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="17.3850" /></div><div><label htmlFor="mt-longitude">Longitude</label><input id="mt-longitude" type="number" step="any" min="-180" max="180" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="78.4867" /></div></div>
            {locationStatus && <p className="mt-location-status" role="status">{locationStatus}</p>}
            <label htmlFor="mt-photo">Add a photo (optional)</label>
            <input id="mt-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
            {preview && <div className="mt-preview-wrap"><img className="mt-preview" src={preview} alt="Selected memory preview" /><button type="button" className="mt-remove-photo" onClick={() => { setPhoto(null); const input = document.getElementById("mt-photo"); if (input) input.value = ""; }}>Remove photo</button></div>}
            <button type="submit" className="mt-button mt-primary mt-save-button" disabled={savingMemory}>{savingMemory ? "Saving memory…" : "✦ Save this memory"}</button>
          </form>

          <form className="mt-form mt-location-form" onSubmit={handleSaveLocation}>
            <div className="mt-form-heading"><span>📍</span><div><h3>Save a location</h3><p>Choose a point on the map or use your current GPS.</p></div></div>
            {pendingPoint && <p className="mt-location-status">Selected coordinates: {pendingPoint[0].toFixed(6)}, {pendingPoint[1].toFixed(6)}</p>}
            <label htmlFor="mt-location-name">Location name</label>
            <input id="mt-location-name" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="e.g. My favourite beach" maxLength={100} required />
            <button type="submit" className="mt-button mt-primary mt-save-button" disabled={savingLocation || !pendingPoint}>{savingLocation ? "Saving location…" : "📍 Save Location"}</button>
            {!pendingPoint && <p className="mt-help">First click “Use current GPS location” or “Choose on map” and click a point.</p>}
          </form>


            <div className="mt-form mt-history-panel mt-saved-locations">
          <div className="mt-form-heading"><span>🔖</span><div><h3>Saved locations</h3><p>Your bookmarked places.</p></div></div>
          {loading ? <p className="mt-empty">Loading…</p> : locations.length === 0 ? <p className="mt-empty">No locations saved yet.</p> : <div className="mt-memory-list">{locations.map((loc) => <article key={loc.id} className="mt-memory-card"><div className="mt-memory-card-body"><h4>{loc.name}</h4><p className="mt-memory-place">📍 {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}</p><p className="mt-memory-story">{loc.date}</p><div className="mt-memory-actions"><button type="button" onClick={() => { setSelectedPoint(loc); setSelectedMemory(null); setPosition(null); setRecenterSignal((v) => v + 1); }}>View on map</button><button type="button" className="mt-delete" onClick={() => handleDeleteLocation(loc.id)}>Delete</button></div></div></article>)}</div>}
            </div>

            <div className="mt-form mt-history-panel mt-journey-history">
          <div className="mt-form-heading"><span>🛣️</span><div><h3>Journey history</h3><p>Saved routes from previous trips.</p></div></div>
          {loading ? <p className="mt-empty">Loading…</p> : trips.length === 0 ? <p className="mt-empty">No saved journeys yet. Start tracking and stop to save your journey, even if you stay in one place.</p> : <div className="mt-memory-list">{trips.map((trip) => <article key={trip.id} className="mt-memory-card"><div className="mt-memory-card-body"><h4>{trip.name}</h4><p className="mt-memory-place">{trip.date}</p><p className="mt-memory-story">{(trip.distanceMeters / 1000).toFixed(2)} km · {formatDuration(trip.durationSeconds)}</p><div className="mt-memory-actions"><button type="button" onClick={() => showTrip(trip)}>View route</button><button type="button" className="mt-delete" onClick={() => handleDeleteTrip(trip.id)}>Delete</button></div></div></article>)}</div>}
            </div>
        </div>

        <div className="mt-gallery-section">
          <div className="mt-gallery">
            <div className="mt-gallery-heading"><div><span className="mt-eyebrow">YOUR PERSONAL JOURNAL</span><h3>Moments worth keeping</h3></div><span className="mt-count">{memories.length}</span></div>
            {loading ? <p className="mt-empty">Loading your memories…</p> : memories.length === 0 ? <div className="mt-empty"><span>✧</span><h4>Your story starts here</h4><p>Save your first memory. Add a location to see its pin on the shared map.</p></div> : <div className="mt-memory-list">{memories.map((memory) => <article key={memory.id} className={`mt-memory-card ${selectedMemory?.id === memory.id ? "is-selected" : ""}`}>
              {photoUrls.get(memory.id) && <button type="button" className="mt-memory-photo-button" onClick={() => { setSelectedMemory(memory); if (validCoords(memory.latitude, memory.longitude)) setRecenterSignal((v) => v + 1); }} aria-label={`Show ${memory.title} on map`}><img className="mt-memory-photo" src={photoUrls.get(memory.id)} alt={memory.title} /></button>}
              <div className="mt-memory-card-body"><div className="mt-memory-card-top"><span className="mt-memory-date">{memory.date}</span>{validCoords(memory.latitude, memory.longitude) && <span className="mt-pinned-label">📍 Pinned</span>}</div><h4>{memory.title}</h4><p className="mt-memory-place">⌖ {memory.place}</p><p className="mt-memory-story">{memory.story}</p><div className="mt-memory-actions"><button type="button" onClick={() => { setSelectedMemory(memory); if (validCoords(memory.latitude, memory.longitude)) setRecenterSignal((v) => v + 1); else setTrackingMessage("This memory has no saved location."); document.getElementById("memory-tracking")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>View on map</button><button type="button" className="mt-delete" onClick={() => handleDeleteMemory(memory.id)}>Delete</button></div></div>
            </article>)}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
