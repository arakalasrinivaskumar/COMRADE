import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MemoryTracking.css";

const DB_NAME = "comrade-memory-db";
const STORE_NAME = "memories";
const DEFAULT_CENTER = [17.385, 78.4867];

const liveIcon = L.divIcon({
  className: "ct-live-icon",
  html: '<div class="ct-live-dot"><span></span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const memoryIcon = L.divIcon({
  className: "ct-memory-icon",
  html: '<div class="ct-memory-pin">📍</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -30],
});

function openMemoryDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support local storage for memories."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllMemories() {
  const db = await openMemoryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}

async function saveMemory(memory) {
  const db = await openMemoryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(memory);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error("Save cancelled.")); };
  });
}

async function deleteMemory(id) {
  const db = await openMemoryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error("Deletion cancelled.")); };
  });
}

function MapController({ target, recenterSignal }) {
  const map = useMap();

  useEffect(() => {
    if (!target || !map) return;

    const moveMap = () => {
      map.flyTo(target, Math.max(map.getZoom(), 13), {
        animate: true,
        duration: 1,
      });
    };

    const timer = window.setTimeout(() => {
      map.invalidateSize();
      moveMap();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [map, target, recenterSignal]);

  return null;
}
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function MemoryTracking() {
  // Saved-memory form and gallery state
  const [memories, setMemories] = useState([]);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [story, setStory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [savingMemory, setSavingMemory] = useState(false);
  const [error, setError] = useState("");

  // Live GPS tracking state
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState("Press Start tracking to begin recording your route.");
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
    let active = true;
    getAllMemories()
      .then((saved) => { if (active) setMemories(saved); })
      .catch((err) => {
        console.error("Unable to load memories:", err);
        if (active) setError("Couldn't load memories. Please check your browser storage.");
      })
      .finally(() => { if (active) setLoadingMemories(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!photo) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const photoUrls = useMemo(() => {
    const urls = new Map();
    memories.forEach((memory) => {
      if (memory.photo instanceof Blob) urls.set(memory.id, URL.createObjectURL(memory.photo));
    });
    return urls;
  }, [memories]);

  useEffect(() => () => photoUrls.forEach((url) => URL.revokeObjectURL(url)), [photoUrls]);

  const mappedMemories = useMemo(() => memories.filter((memory) =>
    Number.isFinite(memory.latitude) && Number.isFinite(memory.longitude) &&
    memory.latitude >= -90 && memory.latitude <= 90 &&
    memory.longitude >= -180 && memory.longitude <= 180
  ), [memories]);

  const selectedMemoryPosition = useMemo(() => (
    selectedMemory && Number.isFinite(selectedMemory.latitude) && Number.isFinite(selectedMemory.longitude)
      ? [selectedMemory.latitude, selectedMemory.longitude]
      : null
  ), [selectedMemory]);

  const mapCenter = selectedMemoryPosition || position || (mappedMemories.length
    ? [mappedMemories[0].latitude, mappedMemories[0].longitude]
    : DEFAULT_CENTER);

  const stopGPS = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  }, []);

  useEffect(() => () => stopGPS(), [stopGPS]);

  useEffect(() => {
    if (!tracking || paused || startedAtRef.current === null) return undefined;
    const timer = window.setInterval(() => {
      setDuration(elapsedBeforeRef.current + Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [tracking, paused]);

  const startGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setTrackingMessage("Your browser does not support GPS location.");
      return;
    }
    setTrackingMessage("Waiting for GPS permission…");
    watchIdRef.current = navigator.geolocation.watchPosition((result) => {
      const next = [result.coords.latitude, result.coords.longitude];
      setPosition(next);
      if (trackingRef.current && !pausedRef.current) {
        const previous = lastPositionRef.current;
        if (!previous) {
          setRoute((current) => [...current, next]);
          lastPositionRef.current = next;
        } else {
          const meters = L.latLng(previous).distanceTo(L.latLng(next));
          if (meters >= 5 && meters < 1000) {
            setDistance((current) => current + meters);
            setRoute((current) => [...current, next]);
            lastPositionRef.current = next;
          } else if (meters >= 1000) {
            // Ignore unrealistic GPS jumps, but use the new point as the next reference.
            lastPositionRef.current = next;
          }
        }
      }
      setTrackingMessage(`GPS active · Accuracy approximately ${Math.round(result.coords.accuracy)} m`);
    }, (gpsError) => {
      const messages = {
        1: "Location permission denied. Allow location access in your browser settings.",
        2: "Your location is unavailable. Try again in an open area.",
        3: "GPS timed out. Please try again.",
      };
      setTrackingMessage(messages[gpsError.code] || "Unable to get your location.");
    }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 });
  }, []);

  const handleStartTracking = () => {
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
const handlePauseTracking = () => {
  if (!trackingRef.current || pausedRef.current) return;

  if (startedAtRef.current !== null) {
    elapsedBeforeRef.current += Math.floor(
      (Date.now() - startedAtRef.current) / 1000
    );
  }

  startedAtRef.current = null;
  setDuration(elapsedBeforeRef.current);

  pausedRef.current = true;
  setPaused(true);

  stopGPS();

  setTrackingMessage(
    "Tracking paused. Your route remains visible on this page."
  );
};

  const handleResumeTracking = () => {
    if (!trackingRef.current || !pausedRef.current) return;
    pausedRef.current = false;
    startedAtRef.current = Date.now();
    setPaused(false);
    startGPS();
  };

  const handleStopTracking = () => {
    stopGPS();
    trackingRef.current = false;
    pausedRef.current = false;
    lastPositionRef.current = null;
    startedAtRef.current = null;
    setTracking(false);
    setPaused(false);
    setTrackingMessage("Tracking stopped. Your route remains visible until you leave or refresh this page.");
  };

  const handleUseLocation = () => {
    setError("");
    setLocationStatus("");
    if (!navigator.geolocation) { setLocationStatus("Location is not supported by this browser."); return; }
    setLocationStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition((result) => {
      setLatitude(result.coords.latitude.toFixed(6));
      setLongitude(result.coords.longitude.toFixed(6));
      setLocationStatus("Location found! Save your memory when ready.");
      setPosition([result.coords.latitude, result.coords.longitude]);
      setRecenterSignal((value) => value + 1);
    }, (gpsError) => {
      const messages = {
        1: "Location permission denied. Allow location access in browser settings.",
        2: "Location is unavailable. Try again or enter coordinates manually.",
        3: "Location request timed out. Please try again.",
      };
      setLocationStatus(messages[gpsError.code] || "Couldn't get your location. Please try again.");
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) { setPhoto(null); return; }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file."); event.target.value = ""; setPhoto(null); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB."); event.target.value = ""; setPhoto(null); return;
    }
    setError("");
    setPhoto(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!title.trim() || !place.trim() || !story.trim()) {
      setError("Please fill in your title, place, and story."); return;
    }
    const hasLat = latitude.trim() !== "";
    const hasLng = longitude.trim() !== "";
    if (hasLat !== hasLng) { setError("Enter both coordinates, or leave both empty."); return; }
    let lat = null;
    let lng = null;
    if (hasLat && hasLng) {
      lat = Number(latitude); lng = Number(longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setError("Invalid coordinates. Latitude must be -90 to 90 and longitude -180 to 180."); return;
      }
    }
    setSavingMemory(true);
    try {
      const newMemory = {
        id: crypto.randomUUID(), title: title.trim(), place: place.trim(), story: story.trim(),
        photo, latitude: lat, longitude: lng, date: new Date().toLocaleDateString(), createdAt: Date.now(),
      };
      await saveMemory(newMemory);
      setMemories((current) => [newMemory, ...current].sort((a, b) => b.createdAt - a.createdAt));
      setSelectedMemory(newMemory);
      if (Number.isFinite(lat) && Number.isFinite(lng)) setRecenterSignal((value) => value + 1);
      setTitle(""); setPlace(""); setStory(""); setPhoto(null); setLatitude(""); setLongitude(""); setLocationStatus("");
      event.target.reset();
    } catch (err) {
      console.error("Unable to save memory:", err);
      setError("Couldn't save this memory. Your browser storage may be full or unavailable.");
    } finally { setSavingMemory(false); }
  };

  const handleDeleteMemory = async (id) => {
    if (!window.confirm("Delete this memory and its saved photo?")) return;
    setError("");
    try {
      await deleteMemory(id);
      setMemories((current) => current.filter((memory) => memory.id !== id));
      setSelectedMemory((current) => current?.id === id ? null : current);
    } catch (err) {
      console.error("Unable to delete memory:", err);
      setError("Couldn't delete this memory. Please try again.");
    }
  };

  const handleRecenter = () => {
    if (!position) { setTrackingMessage("Start tracking or use your current location to find yourself on the map."); return; }
    setRecenterSignal((value) => value + 1);
  };

  return (
    <section className="memory-tracking-section" id="memory-tracking">
      <div className="mt-container">
        <header className="mt-heading">
          <span className="mt-eyebrow">YOUR JOURNEY, YOUR STORY</span>
          <h2>Explore with <span>COMRADE.</span></h2>
          <p>Track your journey live, pin special places, and keep your travel memories together on one map.</p>
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
            <div><span className="mt-live-indicator" /> <strong>Your journey map</strong><p>Live location, route and saved memory pins</p></div>
            <button type="button" className="mt-recenter" onClick={handleRecenter}>⌖ Recenter map</button>
          </div>
          <div className="mt-map-shell">
            <MapContainer center={mapCenter} zoom={position ? 15 : 5} scrollWheelZoom className="mt-map">
            <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  eventHandlers={{
    load: () => console.log("Map tiles loaded"),
  }}
/>
              <MapController target={selectedMemoryPosition || position} recenterSignal={recenterSignal} />
              {position && <><Circle center={position} radius={35} pathOptions={{ color: "#16856b", fillColor: "#16856b", fillOpacity: 0.1 }} /><Marker position={position} icon={liveIcon}><Popup><strong>You are here</strong><br />Live GPS position</Popup></Marker></>}
              {route.length > 1 && <Polyline positions={route} pathOptions={{ color: "#ef8b3d", weight: 5, opacity: 0.9 }} />}
              {mappedMemories.map((memory) => <Marker key={memory.id} position={[memory.latitude, memory.longitude]} icon={memoryIcon} eventHandlers={{ click: () => setSelectedMemory(memory) }}><Popup><div className="mt-popup">{photoUrls.get(memory.id) && <img src={photoUrls.get(memory.id)} alt={memory.title} />}<strong>{memory.title}</strong><span>{memory.place}</span><p>{memory.story}</p><small>{memory.date}</small></div></Popup></Marker>)}
            </MapContainer>
          </div>
          <div className="mt-map-legend"><span><i className="mt-legend-live" /> Live location</span><span><i className="mt-legend-route" /> Recorded route</span><span><i className="mt-legend-memory">📍</i> Saved memory</span></div>
          <div className="mt-tracking-panel">
            <p className="mt-status-message" role="status">{trackingMessage}</p>
            <div className="mt-controls">
              {!tracking && <button type="button" className="mt-button mt-primary" onClick={handleStartTracking}>▶ Start tracking</button>}
              {tracking && !paused && <button type="button" className="mt-button mt-primary" onClick={handlePauseTracking}>Ⅱ Pause</button>}
              {tracking && paused && <button type="button" className="mt-button mt-primary" onClick={handleResumeTracking}>▶ Resume</button>}
              {tracking && <button type="button" className="mt-button mt-secondary" onClick={handleStopTracking}>■ Stop tracking</button>}
              <button type="button" className="mt-button mt-outline" onClick={handleUseLocation}>Use current location for a memory</button>
            </div>
            <p className="mt-privacy">🔒 Your live route stays in this page session. Saved memories and photos are stored locally in this browser, not uploaded to an account.</p>
          </div>
        </div>

          <form className="mt-form" onSubmit={handleSubmit}>
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
        </div>

        <div className="mt-gallery-section">
          <div className="mt-gallery">
            <div className="mt-gallery-heading"><div><span className="mt-eyebrow">YOUR PERSONAL JOURNAL</span><h3>Moments worth keeping</h3></div><span className="mt-count">{memories.length}</span></div>
            {loadingMemories ? <p className="mt-empty">Loading your memories…</p> : memories.length === 0 ? <div className="mt-empty"><span>✧</span><h4>Your story starts here</h4><p>Save your first memory. Add a location to see its pin on the shared map.</p></div> : <div className="mt-memory-list">{memories.map((memory) => <article key={memory.id} className={`mt-memory-card ${selectedMemory?.id === memory.id ? "is-selected" : ""}`}>
              {photoUrls.get(memory.id) && <button type="button" className="mt-memory-photo-button" onClick={() => { setSelectedMemory(memory); if (Number.isFinite(memory.latitude) && Number.isFinite(memory.longitude)) setRecenterSignal((value) => value + 1); }} aria-label={`Show ${memory.title} on map`}><img className="mt-memory-photo" src={photoUrls.get(memory.id)} alt={memory.title} /></button>}
              <div className="mt-memory-card-body"><div className="mt-memory-card-top"><span className="mt-memory-date">{memory.date}</span>{Number.isFinite(memory.latitude) && Number.isFinite(memory.longitude) && <span className="mt-pinned-label">📍 Pinned</span>}</div><h4>{memory.title}</h4><p className="mt-memory-place">⌖ {memory.place}</p><p className="mt-memory-story">{memory.story}</p><div className="mt-memory-actions">
                <button
  type="button"
  onClick={() => {
    setSelectedMemory(memory);

    if (
      Number.isFinite(memory.latitude) &&
      Number.isFinite(memory.longitude)
    ) {
      setRecenterSignal((value) => value + 1);
    } else {
      setTrackingMessage(
        "This memory has no saved location. Add coordinates to view it on the map."
      );
    }
     document
    .getElementById("memory-tracking")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }}
>
  View on map
</button>
                    <button type="button" className="mt-delete" onClick={() => handleDeleteMemory(memory.id)}>Delete</button></div></div>
            </article>
        )}
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
