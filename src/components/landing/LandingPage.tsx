import React from 'react';
import Hero from './Hero.js';
import Features from './Features';
import Testimonials from './Testimonials';
import EmotionalJournaling from './EmotionalJournaling.js';

export const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <EmotionalJournaling />
      <Testimonials />
    </main>
  );
}; 