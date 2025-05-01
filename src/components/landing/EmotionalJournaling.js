import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Calendar, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: BookOpen,
    title: "Guided Journaling",
    description: "Structured prompts to help you express your thoughts and feelings"
  },
  {
    icon: Heart,
    title: "Emotion Tracking",
    description: "Track your emotional patterns and progress over time"
  },
  {
    icon: Calendar,
    title: "Daily Reflections",
    description: "Regular check-ins to maintain emotional well-being"
  },
  {
    icon: BarChart2,
    title: "Progress Insights",
    description: "Visualize your emotional journey and growth"
  }
];

const EmotionalJournaling = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Emotional Journaling
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your emotional journey with our guided journaling feature
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => navigate('/journal')}
              >
                Start Journaling
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalJournaling; 