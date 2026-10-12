import { useState } from "react";

function BucketList() {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState("");

  function addPlace(event) {
    event.preventDefault();

    const name = place.trim();

    if (!name) return;

    const alreadyExists = places.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) return;

    setPlaces((currentPlaces) => [
      ...currentPlaces,
      {
        id: Date.now(),
        name,
        visited: false,
      },
    ]);

    setPlace("");
  }

  function toggleVisited(id) {
    setPlaces((currentPlaces) =>
      currentPlaces.map((item) =>
        item.id === id ? { ...item, visited: !item.visited } : item
      )
    );
  }

  function removePlace(id) {
    setPlaces((currentPlaces) =>
      currentPlaces.filter((item) => item.id !== id)
    );
  }

  return (
    <main className="travel-page">
      <section className="travel-page-header">
        <span className="travel-eyebrow">DREAM IT. EXPLORE IT.</span>
        <h1>My Bucket List ⭐</h1>
        <p>Keep track of the incredible places you dream of exploring.</p>
      </section>

      <section className="travel-panel">
        <h2>Add a destination</h2>

        <form className="trip-form" onSubmit={addPlace}>
          <label>
            Place you want to visit
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="e.g. Kyoto, Japan"
              required
            />
          </label>

          <button type="submit" className="travel-primary-button">
            + Save Place
          </button>
        </form>
      </section>

      <section className="travel-panel">
        <h2>Dream destinations</h2>

        {places.length === 0 ? (
          <p className="travel-empty">
            Your dream destinations will appear here.
          </p>
        ) : (
          <div className="travel-list">
            {places.map((item) => (
              <article className="travel-list-item" key={item.id}>
                <div>
                  <h3>
                    {item.visited ? "✅" : "🌍"} {item.name}
                  </h3>
                  <p>{item.visited ? "Visited" : "Waiting to be explored"}</p>
                </div>

                <div className="travel-actions">
                  <button
                    type="button"
                    className="travel-secondary-button"
                    onClick={() => toggleVisited(item.id)}
                  >
                    {item.visited ? "Not visited" : "Mark visited"}
                  </button>

                  <button
                    type="button"
                    className="travel-delete-button"
                    onClick={() => removePlace(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default BucketList;