import React, { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import VoiceInput from './components/VoiceInput';
import speechService from './utils/speechService';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = async (userMessage, messageHistory) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_PALM_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an empathetic and professional therapist having a conversation with a client. 
Keep your responses concise, conversational, and focused on one topic at a time.
Break your responses into short paragraphs.
Ask one clear question at a time.
Don't overwhelm the user with too much information at once.

Previous conversation:
${messageHistory.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}

User: ${userMessage}

Provide a supportive, natural response as if you're speaking to the client in person.`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.8,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.candidates && data.candidates[0]) {
        const response = data.candidates[0].content.parts[0].text;
        speechService.speak(response);
        return response;
      }

      throw new Error('No valid response received');

    } catch (error) {
      console.error('Error:', error);
      const fallbackResponse = `I understand you're going through a difficult time. Let's focus on what's troubling you most right now. Would you like to explore some coping strategies together?`;
      speechService.speak(fallbackResponse);
      return fallbackResponse;
    }
  };

  const handleNewMessage = async (message, isUser = true) => {
    if (isUser) {
      speechService.stop();
    }

    const newMessage = {
      content: message,
      sender: isUser ? 'user' : 'therapist',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (isUser) {
      setIsTyping(true);
      try {
        const aiResponse = await getAIResponse(message, messages);
        setMessages(prev => [...prev, {
          content: aiResponse,
          sender: 'therapist',
          timestamp: new Date().toISOString(),
        }]);
      } catch (error) {
        console.error('Error in conversation:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Therapist</h1>
      </header>
      <main>
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleNewMessage}
          isTyping={isTyping}
        />
        <VoiceInput onMessageReceived={handleNewMessage} />
      </main>
    </div>
  );
}

export default App;