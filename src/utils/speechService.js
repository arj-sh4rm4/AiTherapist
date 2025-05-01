import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

class SpeechService {
  constructor() {
    this.speechConfig = null;
    this.synthesizer = null;
    this.isSpeaking = false;
    this.utteranceQueue = [];
    this.currentVoiceName = null;
    this.voicePreferences = [
      { name: 'en-GB-SoniaNeural', lang: 'en-GB' },
      { name: 'en-GB-RyanNeural', lang: 'en-GB' },
      { name: 'en-GB-AbbiNeural', lang: 'en-GB' },
      { name: 'en-GB-AlfieNeural', lang: 'en-GB' },
      { name: 'en-AU-NatashaNeural', lang: 'en-AU' },
      { name: 'en-AU-WilliamNeural', lang: 'en-AU' },
      { name: 'en-US-JennyNeural', lang: 'en-US' },
      { name: 'en-US-GuyNeural', lang: 'en-US' }
    ];

    // Character limit for the month (250,000 characters)
    this.MAX_CHARACTERS = 250000;
    this.usedCharacters = 0;
    this.lastResetMonth = new Date().getMonth();
  }

  init() {
    if (this.speechConfig) return;

    // Access the API key and region from the .env file
    const AZURE_TTS_KEY = process.env.REACT_APP_AZURE_TTS_KEY;
    const AZURE_TTS_REGION = process.env.REACT_APP_AZURE_TTS_REGION;

    // Initialize speech configuration with provided credentials
    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(
      AZURE_TTS_KEY,
      AZURE_TTS_REGION
    );

    // Set default voice
    this.setVoice(this.voicePreferences[0].name);

    // Configure audio output
    this.speechConfig.speechSynthesisOutputFormat = speechsdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

    // Create synthesizer
    this.synthesizer = new speechsdk.SpeechSynthesizer(this.speechConfig);

    // Set up event handlers
    this.synthesizer.synthesisStarted = (s, e) => {
      console.log("Speech synthesis started");
      this.isSpeaking = true;
    };

    this.synthesizer.synthesisCompleted = (s, e) => {
      console.log("Speech synthesis completed");
      this.isSpeaking = false;
      this.processNextInQueue();
    };

    this.synthesizer.synthesisError = (s, e) => {
      console.error("Speech synthesis error:", e.error);
      this.isSpeaking = false;
      this.processNextInQueue();
    };
  }

  setVoice(voiceName) {
    if (!this.speechConfig) return;
    
    this.speechConfig.speechSynthesisVoiceName = voiceName;
    this.currentVoiceName = voiceName;
    console.log("Set voice to:", voiceName);
  }

  async speak(text) {
    if (!this.synthesizer) {
      this.init();
    }

    // Reset monthly usage if it's a new month
    this.resetIfNewMonth();

    const charCount = text.length;
    if (this.usedCharacters + charCount > this.MAX_CHARACTERS) {
      alert("TTS usage limit exceeded for the month.");
      return;
    }

    this.usedCharacters += charCount;

    // Split text into natural segments
    const segments = this.splitIntoSegments(text);
    console.log("Split segments:", segments);

    // Add segments to queue
    this.utteranceQueue.push(...segments);

    // Start processing queue if not already speaking
    if (!this.isSpeaking) {
      this.processNextInQueue();
    }
  }

  resetIfNewMonth() {
    const currentMonth = new Date().getMonth();
    if (currentMonth !== this.lastResetMonth) {
      this.usedCharacters = 0; // Reset usage
      this.lastResetMonth = currentMonth;
    }
  }

  async processNextInQueue() {
    if (this.utteranceQueue.length === 0 || this.isSpeaking) return;

    const text = this.utteranceQueue.shift();
    console.log("Speaking:", text);

    try {
      const result = await this.synthesizer.speakTextAsync(text);
      
      if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Speech synthesized successfully");
      } else {
        console.error("Speech synthesis failed:", result.errorDetails);
      }
    } catch (error) {
      console.error("Error in speech synthesis:", error);
    }
  }

  splitIntoSegments(text) {
    // Split text into natural speech segments
    return text.split(/(?<=[.!?])\s+/)
      .filter(s => s.trim())
      .map(s => s.trim());
  }

  stop() {
    if (this.synthesizer) {
      this.synthesizer.close();
      this.synthesizer = null;
    }
    this.utteranceQueue = [];
    this.isSpeaking = false;
  }
}

// Create and export a single instance
const speechService = new SpeechService();
export default speechService;