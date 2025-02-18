class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    const voices = this.synth.getVoices();
    console.log("Available voices:", voices); // Debug log

    this.voice = voices.find(voice => 
      voice.name.includes('Neural') && 
      voice.lang.startsWith('en') && 
      voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.lang.startsWith('en') && 
      voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.lang.startsWith('en')
    );

    console.log("Selected voice:", this.voice); // Debug log
    this.initialized = true;
  }

  speak(text) {
    console.log("Speaking text:", text); // Debug log
    this.init();
    this.stop();

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    console.log("Split sentences:", sentences); // Debug log

    sentences.forEach((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.voice = this.voice;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => console.log("Started speaking:", sentence); // Debug log
      utterance.onend = () => console.log("Finished speaking:", sentence); // Debug log
      utterance.onerror = (e) => console.error("Speech error:", e); // Debug log

      setTimeout(() => {
        this.synth.speak(utterance);
      }, index * 100);
    });
  }

  stop() {
    this.synth.cancel();
  }
}

// Create and export a single instance
const speechService = new SpeechService();

// Initialize voices when they're loaded
window.speechSynthesis.onvoiceschanged = () => {
  console.log("Voices changed event triggered"); // Debug log
  speechService.init();
};

export default speechService; 