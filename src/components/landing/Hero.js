import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#FFF1F5] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-700 leading-tight">
            Your personal AI therapist.
            <br />
            <span className="text-pink-600">Speak. Reflect. Heal.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
            Free voice-based therapy in Hindi, English & Hinglish — powered by emotional intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/chat')}
            >
              Start My Free Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-full px-8 py-6 text-lg transition-all duration-300"
              onClick={() => navigate('/chat?mode=voice')}
            >
              Try Demo
            </Button>
          </div>
        </motion.div>

        {/* Right side - Illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
            {/* Placeholder for illustration or Lottie animation */}
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🎙️</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200 rounded-full opacity-20 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 