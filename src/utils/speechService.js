const speechService = {
  speak: (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || voice.name.includes('Female')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Speak the text
    window.speechSynthesis.speak(utterance);
  },

  stop: () => {
    window.speechSynthesis.cancel();
  }
};

export default speechService; 