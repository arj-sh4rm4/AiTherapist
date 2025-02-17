import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import ChatInterface from './components/ChatInterface';
import VoiceInput from './components/VoiceInput';
import speechService from './utils/speechService';
import JournalPage from './components/JournalPage';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/config';

// Placeholder components for new sections
const HomePage = () => (
  <div className="home-container">
    <h1>Welcome to AI Therapy Assistant</h1>
    <div className="features-grid">
      <Link to="/chat" className="feature-card">
        <div className="feature-icon">💭</div>
        <h2>AI Therapist Chat</h2>
        <p>Have a supportive conversation with our AI therapist</p>
      </Link>
      
      <Link to="/journal" className="feature-card">
        <div className="feature-icon">📔</div>
        <h2>Journal Space</h2>
        <p>Record your thoughts and track your emotional journey</p>
      </Link>
      
      <Link to="/tools" className="feature-card">
        <div className="feature-icon">🧘‍♀️</div>
        <h2>Coping Tools</h2>
        <p>Access helpful exercises and relaxation techniques</p>
      </Link>
    </div>
  </div>
);

const ToolsPage = () => (
  <div className="tools-container">
    <h1>Coping Tools</h1>
    <p>Coping tools feature coming soon...</p>
    <Link to="/" className="back-button">Back to Home</Link>
  </div>
);

const TherapistChat = ({ messages, isTyping, onNewMessage }) => {
  const { currentUser } = useAuth();

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

  const handleLocalMessage = async (message, isUser = true) => {
    if (isUser) {
      speechService.stop();
    }

    const newMessage = {
      content: message,
      sender: isUser ? 'user' : 'therapist',
      timestamp: new Date().toISOString(),
    };

    onNewMessage(newMessage);

    try {
      const conversationRef = collection(db, 'conversations');
      await addDoc(conversationRef, {
        userId: currentUser.uid,
        messages: [...messages, newMessage],
        lastMessageTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    if (isUser) {
      try {
        const aiResponse = await getAIResponse(message, messages);
        onNewMessage({
          content: aiResponse,
          sender: 'therapist',
          timestamp: new Date().toISOString(),
        }, false);
      } catch (error) {
        console.error('Error in conversation:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  return (
    <div className="chat-page">
      <Link to="/" className="back-button">Back to Home</Link>
      <ChatInterface 
        messages={messages} 
        onSendMessage={handleLocalMessage}
        isTyping={isTyping}
      />
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <TherapistChat 
                      messages={messages} 
                      isTyping={isTyping}
                      onNewMessage={(message, isUser) => {
                        setMessages(prev => [...prev, message]);
                        setIsTyping(isUser);
                      }}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/journal" 
                element={
                  <ProtectedRoute>
                    <JournalPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/tools" element={<ToolsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;