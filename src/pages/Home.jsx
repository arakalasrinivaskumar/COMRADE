// src/pages/Home.jsx
// This is the main page. Each section is its own component.
// Pravallika will fill in each section component.

import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import WhyComrade from '../components/WhyComrade'
import Sanchari from '../components/Sanchari'
import Contact from '../components/Contact'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <WhyComrade />
      <Sanchari />
      <Contact />
    </>
  )
}

export default Home
