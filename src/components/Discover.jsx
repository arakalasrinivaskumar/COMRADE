import { useState } from "react";

function Discover({ onViewOnMap }) {
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchPlaces(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      setError("Enter a city or place to explore.");
      return;
    }

    setLoading(true);
    setError("");
    setPlaces([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Search is temporarily unavailable.");
      }

      const data = await response.json();

      const results = data.map((place) => ({
        id: place.place_id,
        name: place.name || place.display_name.split(",")[0],
        address: place.display_name,
        lat: Number(place.lat),
        lon: Number(place.lon),
        image: `https://placehold.co/800x500/e9eee6/203c30?text=${encodeURIComponent(
          place.name || "Explore Place"
        )}`,
      }));

      setPlaces(results);

      if (results.length === 0) {
        setError("No places found. Try another city or destination.");
      }
    } catch {
      setError(
        "We couldn't load places right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleViewOnMap(place) {
    if (typeof onViewOnMap === "function") {
      onViewOnMap(place);
    } else {
      setError("The map connection is not available yet.");
    }
  }

  function saveToBucketList(place) {
    try {
      const savedPlaces = JSON.parse(
        localStorage.getItem("comradeBucketList") || "[]"
      );

      const alreadySaved = savedPlaces.some(
        (item) =>
          item.name?.toLowerCase() === place.name.toLowerCase()
      );

      if (alreadySaved) {
        alert("This place is already saved!");
        return;
      }

      savedPlaces.push({
        id: Date.now(),
        name: place.name,
        visited: false,
        address: place.address,
        lat: place.lat,
        lon: place.lon,
      });

      localStorage.setItem(
        "comradeBucketList",
        JSON.stringify(savedPlaces)
      );

      alert(`${place.name} saved to your Bucket List! ⭐`);
    } catch {
      alert("Unable to save this place. Please try again.");
    }
  }

  return (
    <section className="discover-section" id="discover">
      <div className="discover-heading">
        <div>
          <p className="section-label">EXPLORE THE WORLD</p>

          <h2>
            Find places
            <br />
            <span>worth discovering.</span>
          </h2>
        </div>

        <p>
          Discover local gems, explore destinations around the
          world, and save places you want to experience with COMRADE.
        </p>
      </div>

      <form className="discover-search" onSubmit={searchPlaces}>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search a city, café, park, or destination..."
          aria-label="Search for places"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "🔍 Search Places"}
        </button>
      </form>

      {error && (
        <p className="discover-message" role="status">
          {error}
        </p>
      )}

      {places.length > 0 && (
        <div className="discover-results">
          <h3>Places to explore 🌍</h3>

          <div className="discover-results-grid">
            {places.map((place) => (
              <article
                className="discover-place-card"
                key={place.id}
              >
                <img
                  src={place.image}
                  alt={`Illustration placeholder for ${place.name}`}
                  loading="lazy"
                />

                <div className="discover-place-content">
                  <h4>{place.name}</h4>

                  <p>{place.address}</p>

                  <div className="discover-place-actions">
                    <button
                      type="button"
                      onClick={() => handleViewOnMap(place)}
                    >
                      📍 View on Map
                    </button>

                    <button
                      type="button"
                      onClick={() => saveToBucketList(place)}
                    >
                      ⭐ Save Place
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {!places.length && !loading && !error && (
        <div className="discover-experience">
          <div className="discover-image">
            <img
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1800&q=85"
              alt="Travellers exploring a beautiful destination"
              loading="lazy"
            />

            <div className="image-overlay" />

            <div className="discover-location">
              <span>YOUR NEXT ADVENTURE</span>
              <strong>There's more to explore.</strong>
              <p>Places · People · Experiences</p>
            </div>
          </div>

          <div className="pulse-card">
            <span className="pulse-title">EXPLORE WITH COMRADE</span>

            <h3>
              Where will
              <br />
              you go next?
            </h3>

            <p className="discover-card-description">
              Search for nearby attractions, beautiful destinations,
              and hidden gems waiting to be explored.
            </p>

            <div className="pulse-item">
              <div className="pulse-icon">✦</div>
              <div>
                <strong>Discover places</strong>
                <p>Search for destinations around the world.</p>
              </div>
            </div>

            <div className="pulse-item">
              <div className="pulse-icon">◎</div>
              <div>
                <strong>Explore on a map</strong>
                <p>See where your next adventure awaits.</p>
              </div>
            </div>

            <div className="pulse-item">
              <div className="pulse-icon">♡</div>
              <div>
                <strong>Save your favourites</strong>
                <p>Keep a list of places you want to visit.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Discover;