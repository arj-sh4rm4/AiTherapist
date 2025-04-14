import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const features = [
  {
    name: "Voice therapy available",
    otherApps: false,
    ourApp: true
  },
  {
    name: "Hindi/Hinglish support",
    otherApps: false,
    ourApp: true
  },
  {
    name: "Emotional awareness",
    otherApps: false,
    ourApp: true
  },
  {
    name: "Better voice clarity/accent",
    otherApps: false,
    ourApp: true
  },
  {
    name: "Free tier without signup",
    otherApps: false,
    ourApp: true
  }
];

const OurAdvantage = () => {
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
            Why We're Different
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how we stand out from other AI therapy apps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="col-span-1"></div>
            <div className="text-center font-semibold text-gray-900">Other AI Therapy Apps</div>
            <div className="text-center font-semibold text-pink-600">AI Therapist</div>
          </div>

          {features.map((feature, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 p-6 border-t border-gray-100">
              <div className="col-span-1 font-medium text-gray-900">{feature.name}</div>
              <div className="text-center">
                {feature.otherApps ? (
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                )}
              </div>
              <div className="text-center">
                {feature.ourApp ? (
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurAdvantage; 