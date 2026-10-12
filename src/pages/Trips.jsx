import MemoryTracking from "../components/MemoryTracking";

function MyJourney() {
  return (
    <main className="travel-page">
      <section className="travel-page-header">
        <span className="travel-eyebrow">YOUR TRAVEL STORY</span>
        <h1>My Journey 🌍</h1>
        <p>
          Every place has a story. Revisit your saved locations,
          memories, and experiences.
        </p>
      </section>

      <MemoryTracking />
    </main>
  );
}

export default MyJourney;