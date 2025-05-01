import React, { useState, useRef, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';
import EmergencyResponse from './EmergencyResponse';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import speechService from '../utils/speechService';
import VoiceInput from './VoiceInput';

const EMERGENCY_KEYWORDS = [
  'kill myself',
  'want to die',
  'suicide',
  'end my life',
  'panic attack',
  'anxiety attack',
  'emergency',
  'help me',
  'can\'t breathe',
  'hurting myself'
];

const suggestedResponses = [
  {
    text: "I've been feeling anxious lately",
    icon: "😟"
  },
  {
    text: "I want to talk about my family",
    icon: "👨‍👩‍👧‍👦"
  },
  {
    text: "I'm having trouble sleeping",
    icon: "😴"
  },
  {
    text: "I feel overwhelmed at work",
    icon: "💼"
  }
];

const ChatInterface = ({ messages, onSendMessage, isTyping, isMuted, onMuteToggle }) => {
  const [inputText, setInputText] = useState('');
  const [showEmergencyResponse, setShowEmergencyResponse] = useState(false);
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const checkForEmergency = (text) => {
    const lowerText = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      if (checkForEmergency(inputText)) {
        setShowEmergencyResponse(true);
      }
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleRequestMedicalAssistance = () => {
    // Here you would implement the actual emergency response
    // For now, we'll just show a message
    onSendMessage("Emergency medical assistance has been requested. Help is on the way.");
    setShowEmergencyResponse(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Session</h2>
        <button 
          className="mute-button"
          onClick={() => onMuteToggle(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
      
      {showEmergencyResponse && (
        <EmergencyResponse onRequestMedicalAssistance={handleRequestMedicalAssistance} />
      )}
      
      <div className="messages-container">
        {showSuggestions && messages.length === 0 ? (
          <div className="suggestions-wrapper">
            <h2>Welcome to your safe space</h2>
            <p>What would you like to talk about today?</p>
            <div className="suggestions-grid">
              {suggestedResponses.map((response, index) => (
                <button 
                  key={index}
                  onClick={() => onSendMessage(response.text)}
                  className="suggestion-btn"
                >
                  <span className="suggestion-icon">{response.icon}</span>
                  <span className="suggestion-text">{response.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender}`}
              >
                <p>{message.content}</p>
                <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <div className="input-buttons">
          <VoiceInput onMessageReceived={onSendMessage} />
          <button type="submit" disabled={isTyping || !inputText.trim()}>
            {isTyping ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 