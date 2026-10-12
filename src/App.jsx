import { useState } from "react";

import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Discover from "./components/Discover";
import Destination from "./components/Destination";
import MemoryTracking from "./components/MemoryTracking";
import ComradeCommunity from "./components/ComradeCommunity";
import SOS from "./components/SOS";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

import MyJourney from "./pages/MyJourney";
import Trips from "./pages/Trips";
import BucketList from "./pages/BucketList";
import Insights from "./pages/Insights";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlace, setSelectedPlace] = useState(null);

  function navigateTo(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleViewOnMap(place) {
    setSelectedPlace(place);
    setCurrentPage("home");

    window.setTimeout(() => {
      document.getElementById("memories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }

  return (
    <div>
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />

      {currentPage === "home" && (
        <main>
          <section id="home">
            <Hero />
          </section>

          <section id="features">
            <Features />
          </section>

          <section id="how-it-works">
            <HowItWorks />
          </section>

          <section id="discover">
            <Discover onViewOnMap={handleViewOnMap} />
          </section>

          <section id="destinations">
            <Destination />
          </section>

          <section id="memories">
            <MemoryTracking selectedPlace={selectedPlace} />
          </section>

          <section id="community">
            <ComradeCommunity />
          </section>

          <section id="sos">
            <SOS />
          </section>

          <section id="join">
            <CTA />
          </section>
        </main>
      )}

      {currentPage === "journey" && <MyJourney />}
      {currentPage === "trips" && <Trips />}
      {currentPage === "bucketlist" && <BucketList />}
      {currentPage === "insights" && <Insights />}

      <Footer />
    </div>
  );
}

export default App;