function Insights() {
  const insights = [
    {
      icon: "🗺️",
      title: "Places explored",
      value: "Coming soon",
      description: "Discover how many places you have explored.",
    },
    {
      icon: "✈️",
      title: "Trips completed",
      value: "Coming soon",
      description: "Keep track of your travel adventures.",
    },
    {
      icon: "📸",
      title: "Memories saved",
      value: "Coming soon",
      description: "Celebrate the moments you have collected.",
    },
    {
      icon: "⭐",
      title: "Dream destinations",
      value: "Coming soon",
      description: "See your progress toward your bucket list.",
    },
  ];

  return (
    <main className="travel-page">
      <section className="travel-page-header">
        <span className="travel-eyebrow">YOUR WORLD, YOUR WAY</span>
        <h1>Travel Insights 📊</h1>
        <p>
          Understand your travel habits and celebrate every adventure.
        </p>
      </section>

      <section className="insights-grid">
        {insights.map((insight) => (
          <article className="insight-card" key={insight.title}>
            <span className="insight-icon">{insight.icon}</span>
            <h2>{insight.title}</h2>
            <strong>{insight.value}</strong>
            <p>{insight.description}</p>
          </article>
        ))}
      </section>

      <p className="travel-note">
        Live statistics will be connected to your saved trips, memories,
        and bucket list in a later step.
      </p>
    </main>
  );
}

export default Insights;