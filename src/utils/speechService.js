import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

class SpeechService {
  constructor() {
    this.speechConfig = null;
    this.synthesizer = null;
    this.isSpeaking = false;
    this.utteranceQueue = [];
    this.currentVoiceName = null;
    this.voicePreferences = [
      // British English (most natural for therapy)
      { name: 'en-GB-SoniaNeural', lang: 'en-GB' },
      { name: 'en-GB-RyanNeural', lang: 'en-GB' },
      { name: 'en-GB-AbbiNeural', lang: 'en-GB' },
      { name: 'en-GB-AlfieNeural', lang: 'en-GB' },
      
      // Australian English (also very natural)
      { name: 'en-AU-NatashaNeural', lang: 'en-AU' },
      { name: 'en-AU-WilliamNeural', lang: 'en-AU' },
      
      // US English (if preferred)
      { name: 'en-US-JennyNeural', lang: 'en-US' },
      { name: 'en-US-GuyNeural', lang: 'en-US' }
    ];
  }

  init() {
    if (this.speechConfig) return;

    // Initialize speech configuration with provided credentials
    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(
      '15vyptwwWpVzzJDYilzfLeBcefiA4O0IUg9BCpTlRGLXjpaTZZcMJQQJ99BDACGhslBXJ3w3AAAYACOG4nIY',
      'centralindia'
    );

    // Set default voice
    this.setVoice(this.voicePreferences[0].name);
    
    // Configure audio output
    this.speechConfig.speechSynthesisOutputFormat = 
      speechsdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

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