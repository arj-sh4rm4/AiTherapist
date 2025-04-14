import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import OurAdvantage from './OurAdvantage';
import EmotionalJournaling from './EmotionalJournaling';

const LandingPage = () => {
  return (
    <div className="font-sans">
      <Hero />
      <HowItWorks />
      <OurAdvantage />
      <EmotionalJournaling />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage; 