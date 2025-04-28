import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, BookOpen, Shield, Mic } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-12 h-12 text-pink-600" />,
    title: "Emotionally Intelligent",
    description: "Our AI understands and responds to your emotions with empathy and care."
  },
  {
    icon: <Mic className="w-12 h-12 text-pink-600" />,
    title: "Advanced TTS",
    description: "Experience natural, human-like conversations with our state-of-the-art text-to-speech technology."
  },
  {
    icon: <BookOpen className="w-12 h-12 text-pink-600" />,
    title: "Personalized Journal",
    description: "Track your emotional journey with our guided journaling feature."
  },
  {
    icon: <Shield className="w-12 h-12 text-pink-600" />,
    title: "Safe & Confidential",
    description: "Your conversations are private and secure, creating a safe space for healing."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Therapist?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience therapy that's accessible, empathetic, and tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 