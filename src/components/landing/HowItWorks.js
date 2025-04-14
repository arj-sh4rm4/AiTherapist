import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, BookOpen, Heart } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: "Start a Conversation",
    description: "Begin by sharing your thoughts and feelings with our AI therapist"
  },
  {
    icon: Mic,
    title: "Voice or Text",
    description: "Choose to speak or type - our AI understands both voice and text"
  },
  {
    icon: BookOpen,
    title: "Journal Your Journey",
    description: "Document your emotional progress in your personal journal"
  },
  {
    icon: Heart,
    title: "Track Your Growth",
    description: "Monitor your emotional well-being and see your progress over time"
  }
];

const HowItWorks = () => {
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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to start your journey towards better emotional well-being
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-pink-50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-lg font-semibold">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 