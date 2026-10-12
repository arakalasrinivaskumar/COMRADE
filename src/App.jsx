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

  // Stores the place selected in Discover.
  const [selectedPlace, setSelectedPlace] = useState(null);

  function navigateTo(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Connect Discover to the existing Memory Tracking map.
  function handleViewOnMap(place) {
    setSelectedPlace(place);

    // Keep the home page open so the existing map is available.
    setCurrentPage("home");

    // Scroll to the existing map after React renders.
    window.setTimeout(() => {
      document.getElementById("memory-tracking")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
      />

      {currentPage === "home" && (
        <>
          <div id="home">
            <Hero />
          </div>

          <div id="features">
            <Features />
          </div>

          <div id="how-it-works">
            <HowItWorks />
          </div>

          <div id="discover">
            <Discover onViewOnMap={handleViewOnMap} />
          </div>

          <div id="destinations">
            <Destination />
          </div>

          <div id="memories">
            <MemoryTracking selectedPlace={selectedPlace} />
          </div>

          <div id="community">
            <ComradeCommunity />
          </div>

          <div id="sos">
            <SOS />
          </div>

          <div id="join">
            <CTA />
          </div>
        </>
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