import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceInput = ({ onMessageReceived }) => {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const startListening = () => {
    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US'
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    
    if (transcript.trim()) {
      onMessageReceived(transcript);
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="voice-error">
        Please allow microphone access to use voice input
      </div>
    );
  }

  return (
    <>
      {isListening && (
        <div className="voice-feedback">
          <p>{transcript || 'Listening...'}</p>
        </div>
      )}
      <button 
        className={`voice-button ${listening ? 'listening' : ''}`}
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        title="Hold to speak"
      >
        {listening ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>
    </>
  );
};

export default VoiceInput; 