// This file serves as a bridge between React and the Python therapy model
// It uses Pyodide to run Python code in the browser

import { loadPyodide } from 'pyodide';

class TherapyModelBridge {
  constructor() {
    this.pyodide = null;
    this.modelLoaded = false;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Loading Pyodide...');
      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });
      
      console.log('Pyodide loaded, installing dependencies...');
      await this.pyodide.loadPackage(['numpy', 'micropip']);
      
      // Load the therapy_bot.py file
      console.log('Loading therapy_bot.py...');
      const therapyBotCode = await fetch('/Therapist_Model/therapy_bot.py').then(response => response.text());
      
      // Execute the Python code
      await this.pyodide.runPythonAsync(therapyBotCode);
      
      // Create an instance of the ImprovedTherapyBot class
      console.log('Creating therapy bot instance...');
      await this.pyodide.runPythonAsync(`
        therapy_bot = ImprovedTherapyBot(
          emotion_model_path="./Therapist_Model/emotion_model",
          therapy_model_name="microsoft/DialoGPT-medium"
        )
      `);
      
      this.modelLoaded = true;
      this.initialized = true;
      console.log('Therapy model initialized successfully!');
    } catch (error) {
      console.error('Error initializing therapy model:', error);
      throw error;
    }
  }

  async processMessage(userMessage, conversationHistory) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Convert conversation history to Python format
      const historyStr = JSON.stringify(conversationHistory);
      
      // Call the process_conversation method
      const result = await this.pyodide.runPythonAsync(`
        import json
        history = json.loads('${historyStr}')
        response = therapy_bot.process_conversation('${userMessage.replace(/'/g, "\\'")}')
        json.dumps({
          'response': response,
          'emotion': therapy_bot.last_emotion,
          'confidence': therapy_bot.emotion_cache.get(therapy_bot.last_emotion, 0.0)
        })
      `);
      
      return JSON.parse(result);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

// Create and export a single instance
const therapyModelBridge = new TherapyModelBridge();
export default therapyModelBridge; 