import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Memory.css";

const DB_NAME = "comrade-memory-db";
const STORE_NAME = "memories";

// Custom map pin
const memoryIcon = L.divIcon({
  className: "memory-map-marker-wrapper",
  html: '<div class="memory-map-marker">📍</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -30],
});

// Open IndexedDB
function openMemoryDB() {
  return new Promise((resolve, reject) => {
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

// Read all memories
async function getAllMemories() {
  const db = await openMemoryDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      resolve(
        request.result.sort((a, b) => b.createdAt - a.createdAt)
      );
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

// Save a memory
async function saveMemory(memory) {
  const db = await openMemoryDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(memory);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error("Save cancelled."));
    };
  });
}

// Delete a memory
async function deleteMemory(id) {
  const db = await openMemoryDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error("Deletion cancelled."));
    };
  });
}

// Move map to selected memory
function MapView({ center, zoom, selectedMemory }) {
  const map = useMap();

  useEffect(() => {
    if (selectedMemory) {
      map.flyTo(
        [selectedMemory.latitude, selectedMemory.longitude],
        13,
        { duration: 1.2 }
      );
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, zoom, selectedMemory]);

  return null;
}

function Memory() {
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load saved memories
  useEffect(() => {
    let active = true;

    async function loadMemories() {
      try {
        const saved = await getAllMemories();

        if (active) {
          setMemories(saved);
        }
      } catch (err) {
        console.error("Unable to load memories:", err);

        if (active) {
          setError("Couldn't load memories. Please check browser storage.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMemories();

    return () => {
      active = false;
    };
  }, []);

  // Create a preview of the selected photo
  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(photo);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [photo]);

  // Get GPS location only after clicking the button
  function handleGetLocation() {
    setError("");
    setLocationStatus("");

    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported by this browser.");
      return;
    }

    setLocationStatus("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationStatus("Location found! Save your memory when ready.");
      },
      (locationError) => {
        const messages = {
          1: "Location permission denied. Allow location access in browser settings.",
          2: "Location is unavailable. Try again or enter coordinates manually.",
          3: "Location request timed out. Please try again.",
        };

        setLocationStatus(
          messages[locationError.code] ||
            "Couldn't get your location. Please try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  // Validate uploaded photo
  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      event.target.value = "";
      setPhoto(null);
      return;
    }

    setError("");
    setPhoto(file);
  }

  // Save a new memory
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !place.trim() || !story.trim()) {
      setError("Please fill in your title, place, and story.");
      return;
    }

    const hasLatitude = latitude.trim() !== "";
    const hasLongitude = longitude.trim() !== "";

    if (hasLatitude !== hasLongitude) {
      setError("Enter both coordinates, or leave both empty.");
      return;
    }

    let lat = null;
    let lng = null;

    if (hasLatitude && hasLongitude) {
      lat = Number(latitude);
      lng = Number(longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        setError(
          "Invalid coordinates. Latitude must be -90 to 90 and longitude -180 to 180."
        );
        return;
      }
    }

    setSaving(true);

    try {
      const newMemory = {
        id: crypto.randomUUID(),
        title: title.trim(),
        place: place.trim(),
        story: story.trim(),
        photo,
        latitude: lat,
        longitude: lng,
        date: new Date().toLocaleDateString(),
        createdAt: Date.now(),
      };

      await saveMemory(newMemory);

      setMemories((current) =>
        [newMemory, ...current].sort(
          (a, b) => b.createdAt - a.createdAt
        )
      );

      setTitle("");
      setPlace("");
      setStory("");
      setPhoto(null);
      setLatitude("");
      setLongitude("");
      setLocationStatus("");

      event.target.reset();
    } catch (err) {
      console.error("Unable to save memory:", err);

      setError(
        "Couldn't save this memory. Your browser storage may be full or unavailable."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a saved memory
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this memory and its saved photo?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteMemory(id);

      setMemories((current) =>
        current.filter((memory) => memory.id !== id)
      );

      setSelectedMemory((current) =>
        current?.id === id ? null : current
      );
    } catch (err) {
      console.error("Unable to delete memory:", err);
      setError("Couldn't delete this memory. Please try again.");
    }
  }

  // Select memories with valid GPS coordinates
  const mappedMemories = useMemo(
    () =>
      memories.filter(
        (memory) =>
          Number.isFinite(memory.latitude) &&
          Number.isFinite(memory.longitude) &&
          memory.latitude >= -90 &&
          memory.latitude <= 90 &&
          memory.longitude >= -180 &&
          memory.longitude <= 180
      ),
    [memories]
  );

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (mappedMemories.length === 0) {
      return [20, 0];
    }

    const lat =
      mappedMemories.reduce((sum, memory) => sum + memory.latitude, 0) /
      mappedMemories.length;

    const lng =
      mappedMemories.reduce((sum, memory) => sum + memory.longitude, 0) /
      mappedMemories.length;

    return [lat, lng];
  }, [mappedMemories]);

  const mapZoom = mappedMemories.length === 1 ? 10 : 2;

  // Create temporary photo URLs for the gallery and map popups
  const photoUrls = useMemo(() => {
    const urls = new Map();

    memories.forEach((memory) => {
      if (memory.photo instanceof Blob) {
        urls.set(memory.id, URL.createObjectURL(memory.photo));
      }
    });

    return urls;
  }, [memories]);

  useEffect(() => {
    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoUrls]);

  return (
    <section className="memory-section" id="memories">
      <div className="memory-container">
        <div className="memory-heading">
          <span className="memory-eyebrow">
            YOUR JOURNEY, YOUR STORY
          </span>

          <h2>
            Collect moments.
            <br />
            <span>Keep them forever.</span>
          </h2>

          <p>
            Every destination has a story. Save the little moments that
            make your journey unforgettable.
          </p>
        </div>

        <div className="memory-layout">
          {/* Save memory form */}
          <form className="memory-form" onSubmit={handleSubmit}>
            <div className="memory-form-heading">
              <span>✦</span>
              <h3>Save a memory</h3>
            </div>

            <label htmlFor="memory-title">Memory title</label>
            <input
              id="memory-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A beautiful evening..."
              maxLength={80}
              required
            />

            <label htmlFor="memory-place">Where was it?</label>
            <input
              id="memory-place"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="Goa, India"
              maxLength={120}
              required
            />

            <label htmlFor="memory-story">Your story</label>
            <textarea
              id="memory-story"
              value={story}
              onChange={(event) => setStory(event.target.value)}
              placeholder="Write about this special moment..."
              rows={4}
              maxLength={1000}
              required
            />

            <div className="memory-location-heading">
              <label htmlFor="memory-latitude">
                📍 Pin your location (optional)
              </label>

              <button
                type="button"
                className="memory-location-button"
                onClick={handleGetLocation}
              >
                Use my current location
              </button>
            </div>

            <p className="memory-location-help">
              GPS is used only after you click the button and grant
              permission. You can also enter coordinates manually.
            </p>

            <div className="memory-coordinate-fields">
              <div>
                <label htmlFor="memory-latitude">Latitude</label>
                <input
                  id="memory-latitude"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="17.3850"
                />
              </div>

              <div>
                <label htmlFor="memory-longitude">Longitude</label>
                <input
                  id="memory-longitude"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="78.4867"
                />
              </div>
            </div>

            {locationStatus && (
              <p className="memory-location-status" role="status">
                {locationStatus}
              </p>
            )}

            <label htmlFor="memory-photo">Add a photograph</label>
            <input
              id="memory-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            {preview && (
              <img
                className="memory-upload-preview"
                src={preview}
                alt="Preview of your travel memory"
              />
            )}

            <button
              className="memory-save-button"
              type="submit"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "+ Save My Memory"}
            </button>

            <p className="memory-private-note">
              🔒 Memories are stored in this browser on this device, not
              uploaded to an online account.
            </p>

            {error && (
              <p className="memory-error" role="alert">
                {error}
              </p>
            )}
          </form>

          {/* Travel journal and map */}
          <div className="memory-gallery">
            <div className="memory-gallery-heading">
              <div>
                <span className="memory-eyebrow">
                  LITTLE PIECES OF LIFE
                </span>
                <h3>My travel journal</h3>
              </div>

              <span className="memory-count">
                {memories.length}{" "}
                {memories.length === 1 ? "memory" : "memories"}
              </span>
            </div>

            <div className="memory-map-section">
              <div className="memory-map-heading">
                <div>
                  <span className="memory-eyebrow">
                    YOUR ADVENTURES
                  </span>
                  <h3>My memory map 🗺️</h3>
                </div>

                <span className="memory-count">
                  {mappedMemories.length}{" "}
                  {mappedMemories.length === 1 ? "pin" : "pins"}
                </span>
              </div>

              <div className="memory-map">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  scrollWheelZoom
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapView
                    center={mapCenter}
                    zoom={mapZoom}
                    selectedMemory={selectedMemory}
                  />

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {mappedMemories.map((memory) => (
                    <Marker
                      key={memory.id}
                      position={[
                        memory.latitude,
                        memory.longitude,
                      ]}
                      icon={memoryIcon}
                      eventHandlers={{
                        click: () => setSelectedMemory(memory),
                      }}
                    >
                      <Popup>
                        <div className="memory-map-popup">
                          {photoUrls.get(memory.id) && (
                            <img
                              src={photoUrls.get(memory.id)}
                              alt={memory.title}
                              className="memory-popup-photo"
                            />
                          )}

                          <strong>{memory.title}</strong>
                          <p>📍 {memory.place}</p>
                          <small>{memory.date}</small>

                          <p className="memory-popup-story">
                            {memory.story}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <p className="memory-map-caption">
                {mappedMemories.length > 0
                  ? "Tap a pin to revisit its photo, story, and travel details."
                  : "Your map is waiting for its first location-tagged memory. Add coordinates to place a pin!"}
              </p>
            </div>

            {loading ? (
              <div className="memory-empty">
                <p>Loading your memories...</p>
              </div>
            ) : memories.length === 0 ? (
              <div className="memory-empty">
                <span className="memory-empty-icon">📸</span>
                <h3>Your story starts here</h3>
                <p>
                  Add your first photo, write your story, and begin
                  creating your own travel archive.
                </p>
              </div>
            ) : (
              <div className="memory-grid">
                {memories.map((memory) => {
                  const hasLocation =
                    Number.isFinite(memory.latitude) &&
                    Number.isFinite(memory.longitude);

                  return (
                    <article className="memory-card" key={memory.id}>
                      {photoUrls.get(memory.id) ? (
                        <img
                          className="memory-card-photo"
                          src={photoUrls.get(memory.id)}
                          alt={memory.title}
                        />
                      ) : (
                        <div className="memory-card-no-photo">
                          ✦
                        </div>
                      )}

                      <div className="memory-card-content">
                        <span className="memory-card-date">
                          {memory.date}
                        </span>

                        <h4>{memory.title}</h4>

                        <p className="memory-card-place">
                          📍 {memory.place}
                        </p>

                        <p className="memory-card-story">
                          {memory.story}
                        </p>

                        {hasLocation && (
                          <>
                            <p className="memory-card-coordinates">
                              🗺️ {memory.latitude.toFixed(5)},{" "}
                              {memory.longitude.toFixed(5)}
                            </p>

                            <button
                              type="button"
                              className="memory-view-map-button"
                              onClick={() =>
                                setSelectedMemory(memory)
                              }
                            >
                              📍 View on Map
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          className="memory-delete-button"
                          onClick={() => handleDelete(memory.id)}
                        >
                          Delete memory
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Memory;