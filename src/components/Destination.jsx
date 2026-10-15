
import { useMemo, useState } from "react";
import destinationData from "./DestinationData";
import destinationImages from "./destinationImages";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

function Destination() {
  const [selectedDestination, setSelectedDestination] = useState(
    destinationData[0]
  );
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const filters = ["ALL", "CULTURE", "NATURE", "HiddenSpots", "ENTERTAINMENT"];

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return destinationData.filter((destination) => {
      const matchesCategory =
        activeFilter === "ALL" ||
        destination.category === activeFilter;

      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const visibleDestinations = filteredDestinations.slice(
    0,
    visibleCount
  );

  const getDestinationImage = (destination) =>
    destinationImages[destination.name] || FALLBACK_IMAGE;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleCount(4);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(4);
  };

  const selectDestination = (destination) => {
    setSelectedDestination(destination);
  };

  const selectAndScrollToDestination = (name) => {
    const destination = destinationData.find(
      (item) => item.name === name
    );

    if (destination) {
      selectDestination(destination);

      document
        .getElementById("destination-explorer")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  if (!destinationData.length) {
    return (
      <section className="destination-section" id="destinations">
        <p>No destinations available.</p>
      </section>
    );
  }

  return (
    <section className="destination-section" id="destinations">
      {/* Destination introduction */}
      <div className="destination-hero">
        <div className="destination-eyebrow">
          <span className="destination-eyebrow-line" />
          DISCOVER THE CITY OF NIZAMS
        </div>

        <h2>
          Not just places.
          <br />
          <em>Stories waiting to happen.</em>
        </h2>

        <div className="destination-intro-bottom">
          <p>
            Discover Hyderabad&apos;s historic landmarks, peaceful
            lakes, hidden gems, and cultural experiences. Your next
            local adventure begins right here.
          </p>

          <button
            type="button"
            className="destination-explore-button"
            onClick={() =>
              document
                .getElementById("destination-explorer")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          >
            Explore Hyderabad spots <span>↓</span>
          </button>
        </div>
      </div>

      {/* Destination explorer */}
      <div
        className="destination-explorer"
        id="destination-explorer"
      >
        <div className="destination-explorer-heading">
          <div>
            <p className="destination-small-label">
              YOUR NEXT ADVENTURE
            </p>
            <h3>Where will Hyderabad take you?</h3>
          </div>

          <span className="destination-count">
            {destinationData.length} HYDERABAD SPOTS
          </span>
        </div>

        <div className="destination-explorer-layout">
          {/* Hyderabad scrapbook */}
          <div className="destination-map scrapbook-map">
            <div className="scrapbook-header">
              <div>
                <span className="scrapbook-eyebrow">
                  ✈ THE COMRADE JOURNAL
                </span>
                <h3>Hyderabad, one story at a time</h3>
              </div>

              <span className="scrapbook-edition">
                VOL. 01
                <br />
                HYDERABAD EDITION
              </span>
            </div>

            <div className="scrapbook-collage">
              <span className="scrapbook-region region-one">
                OLD CITY
              </span>

              <span className="scrapbook-region region-two">
                LAKESIDE
              </span>

              <span className="scrapbook-region region-three">
                HERITAGE
              </span>

              <svg
                className="scrapbook-flight-path"
                viewBox="0 0 600 330"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M85 90 Q180 15 280 120 T490 80 Q420 180 300 260" />
                <path d="M85 90 Q110 170 180 230" />
              </svg>

              <div className="scrapbook-photo scrapbook-photo-one">
                <span className="scrapbook-tape" />
                <img
                  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80"
                  alt="City skyline"
                  loading="lazy"
                />
                <strong>City of Nizams</strong>
                <small>THE HYDERABAD STORY</small>
              </div>

              <div className="scrapbook-photo scrapbook-photo-two">
                <span className="scrapbook-tape" />
                <img
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80"
                  alt="Tropical landscape"
                  loading="lazy"
                />
                <strong>Lakeside moments</strong>
                <small>PAUSE BY THE WATER</small>
              </div>

              <div className="scrapbook-photo scrapbook-photo-three">
                <span className="scrapbook-tape" />
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
                  alt="Mountain landscape"
                  loading="lazy"
                />
                <strong>Heritage trails</strong>
                <small>EXPLORE THE PAST</small>
              </div>

              <button
                type="button"
                className="scrapbook-pin pin-charminar"
                onClick={() =>
                  selectAndScrollToDestination("Charminar")
                }
                aria-label="Select Charminar"
                title="Explore Charminar"
              >
                ✦
              </button>

              <button
                type="button"
                className="scrapbook-pin pin-hussain-sagar"
                onClick={() =>
                  selectAndScrollToDestination("Hussain Sagar")
                }
                aria-label="Select Hussain Sagar"
                title="Explore Hussain Sagar"
              >
                ✦
              </button>

              <button
                type="button"
                className="scrapbook-pin pin-golconda-fort"
                onClick={() =>
                  selectAndScrollToDestination("Golconda Fort")
                }
                aria-label="Select Golconda Fort"
                title="Explore Golconda Fort"
              >
                ✦
              </button>

              <span className="scrapbook-stamp">
                PASSPORT
                <br />
                TO ADVENTURE
              </span>

              <span className="scrapbook-plane" aria-hidden="true">
                ✈
              </span>
            </div>

            <div className="scrapbook-footer">
              <span>✳ COLLECT HYDERABAD MEMORIES</span>
              <span>YOUR CITY, YOUR STORY ↗</span>
            </div>
          </div>

          {/* Featured destination */}
          <article className="destination-featured">
            <div className="destination-featured-image">
              <img
                src={getDestinationImage(selectedDestination)}
                alt={selectedDestination.name}
                loading="lazy"
              />

              <span className="destination-photo-tag">
                {selectedDestination.category}
              </span>

              <span className="destination-photo-index">
                {String(selectedDestination.id).padStart(2, "0")} /{" "}
                {destinationData.length}
              </span>
            </div>

            <div className="destination-featured-content">
              <p>{selectedDestination.country}</p>
              <h3>{selectedDestination.name}</h3>

              <p className="destination-featured-description">
                {selectedDestination.description}
              </p>

              <button
                type="button"
                className="destination-next-button"
                onClick={() => {
                  const currentIndex = destinationData.findIndex(
                    (destination) =>
                      destination.id === selectedDestination.id
                  );

                  const nextIndex =
                    (currentIndex + 1) % destinationData.length;

                  selectDestination(destinationData[nextIndex]);
                }}
              >
                Discover another place <span>→</span>
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Destination search and cards */}
      <div
        className="destination-journal"
        id="destination-discoveries"
      >
        <div className="destination-journal-heading">
          <div>
            <p className="destination-small-label">
              YOUR HYDERABAD BUCKET LIST
            </p>
            <h3>Find your next local adventure.</h3>
          </div>

          <p>
            {destinationData.length} places to explore.
            <br />
            Countless stories to create.
          </p>
        </div>

        <label
          className="destination-search-label"
          htmlFor="destination-search"
        >
          Search destinations
        </label>

        <input
          id="destination-search"
          className="destination-search"
          type="search"
          placeholder="Try Charminar, Golconda Fort..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <div
          className="destination-filters"
          aria-label="Filter destinations"
        >
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={`destination-filter ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => handleFilterChange(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter === "ALL"
                ? "All places"
                : filter.charAt(0) +
                  filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <p className="destination-results-count" aria-live="polite">
          Showing {visibleDestinations.length} of{" "}
          {filteredDestinations.length} destinations
        </p>

        {visibleDestinations.length > 0 ? (
          <div className="destination-journal-grid">
            {visibleDestinations.map((destination) => (
              <button
                type="button"
                className="destination-postcard"
                key={destination.id}
                onClick={() => {
                  selectDestination(destination);

                  document
                    .getElementById("destination-explorer")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                aria-label={`View ${destination.name}, ${destination.country}`}
              >
                <div className="destination-postcard-image">
                  <img
                    src={getDestinationImage(destination)}
                    alt={destination.name}
                    loading="lazy"
                  />

                  <span className="destination-postcard-number">
                    {String(destination.id).padStart(2, "0")}
                  </span>

                  <span className="destination-postcard-arrow">
                    ↗
                  </span>
                </div>

                <div className="destination-postcard-caption">
                  <div>
                    <p>{destination.country}</p>
                    <h4>{destination.name}</h4>
                  </div>
                  <span>✳</span>
                </div>

                <p className="destination-postcard-description">
                  {destination.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="destination-empty-state">
            <h4>No destinations found just yet.</h4>
            <p>Try another place or choose a different category.</p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("ALL");
                setVisibleCount(4);
              }}
            >
              Clear search and filters
            </button>
          </div>
        )}

        {visibleCount < filteredDestinations.length && (
          <button
            type="button"
            className="destination-load-more"
            onClick={() =>
              setVisibleCount((count) => count + 4)
            }
          >
            Load more destinations <span>↓</span>
          </button>
        )}
      </div>

      {/* Closing message */}
      <div className="destination-closing">
        <span className="destination-closing-star">✳</span>

        <div>
          <p>DON&apos;T JUST LIVE IN HYDERABAD.</p>
          <h3>
            <em>Experience its story.</em>
          </h3>
        </div>

        <span className="destination-closing-note">
          Your Hyderabad story starts here.
        </span>

        <button
          type="button"
          className="flow-down-button flow-down-dark"
          style={{ marginTop: "18px" }}
          onClick={() =>
            document.getElementById("memories")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          Explore Memory &amp; Live Tracking Map ↓
        </button>
      </div>
    </section>
  );
}

export default Destination;