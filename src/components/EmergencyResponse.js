import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Heart, Shield } from 'lucide-react';

const EmergencyResponse = ({ onRequestMedicalAssistance }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency Support</h2>
            <p className="text-gray-600">You're not alone. Help is available right now.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl">
              <Phone className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-600">Emergency Helpline</h3>
                <p className="text-gray-600">Call 988 for immediate support</p>
                <p className="text-sm text-gray-500 mt-1">Available 24/7, free and confidential</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-600">Calming Techniques</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                  <li>Take slow, deep breaths</li>
                  <li>Focus on the present moment</li>
                  <li>Remember that feelings are temporary</li>
                  <li>You are not alone in this</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
              <Shield className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-600">Medical Assistance</h3>
                <p className="text-gray-600">Would you like us to connect you with emergency medical services?</p>
                <button
                  onClick={onRequestMedicalAssistance}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Request Medical Assistance
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your safety is our top priority. Please reach out for help.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyResponse; 