import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, BookHeart, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Emotionally Intelligent",
    description: "Our AI understands and responds to your emotions with empathy and insight."
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Communicate freely in Hindi, English, or Hinglish - whatever feels most natural to you."
  },
  {
    icon: BookHeart,
    title: "Personalized Journal",
    description: "Track your emotional journey with guided journaling and meaningful reflections."
  },
  {
    icon: Shield,
    title: "Safe & Confidential",
    description: "Your conversations are private and secure, ensuring a safe space for sharing."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Therapist?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience a new way of therapy that combines artificial intelligence with human understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 