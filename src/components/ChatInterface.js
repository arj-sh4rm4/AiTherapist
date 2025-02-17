import React, { useState, useRef, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';
import EmergencyResources from './EmergencyResources';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import speechService from '../utils/speechService';
import VoiceInput from './VoiceInput';

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

const ChatInterface = ({ messages, onSendMessage, isTyping }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const showEmergencyResources = messages.some(message => 
    message.content.toLowerCase().includes('suicide') ||
    message.content.toLowerCase().includes('kill myself') ||
    message.content.toLowerCase().includes('want to die')
  );

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      speechService.stop();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Session</h2>
        <button 
          className="mute-button"
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {showEmergencyResources && <EmergencyResources />}
      
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