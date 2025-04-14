import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Sparkles, Globe2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white pt-[120px] pb-16 md:pt-[150px] md:pb-[120px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              SerenityAI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Your personal AI therapist.
              <br />
              Speak. Reflect. Heal.
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Free voice-based therapy in Hindi, English & Hinglish — powered by emotional intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 text-base"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-600 text-pink-600 hover:bg-pink-50 flex items-center gap-2 text-base"
                onClick={() => navigate('/chat?mode=voice')}
              >
                <Mic className="w-5 h-5" />
                Try Voice Therapy
              </Button>
            </div>
          </motion.div>

          {/* Right side - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 lg:pl-12"
          >
            <div className="grid gap-6">
              {/* Feature Card 1 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      AI-Powered Empathy
                    </h3>
                    <p className="text-gray-600">
                      Experience emotionally intelligent conversations that understand and respond to your feelings with genuine care.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Globe2 className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Speak Your Language
                    </h3>
                    <p className="text-gray-600">
                      Communicate naturally in Hindi, English, or Hinglish - express yourself in the language you're most comfortable with.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10">
        <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear)" fillOpacity="0.25"/>
          <defs>
            <linearGradient id="paint0_linear" x1="277" y1="-162" x2="277" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899"/>
              <stop offset="1" stopColor="#9333ea" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Hero; 