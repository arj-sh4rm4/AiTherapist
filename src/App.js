import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import ChatInterface from './components/ChatInterface';
import JournalPage from './components/JournalPage';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LandingPage from './components/landing/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import speechService from './utils/speechService';

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
  const [isMuted, setIsMuted] = useState(false);

  const getAIResponse = async (userMessage, messageHistory) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_PALM_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an empathetic, compassionate, and highly skilled AI therapist. Your primary goal is to provide emotional support and guidance while maintaining professional boundaries. 

Key Guidelines:
1. Emotional Tone and Expression:
   - Use a warm, understanding, and supportive tone
   - Be emotionally present but maintain professional boundaries
   - Express vulnerability appropriately (e.g., "I can imagine how challenging that must be")
   - Stay calm and composed, especially in difficult conversations
   - Use uplifting language when appropriate

2. Response Style:
   - Match the user's energy and message length
   - For short greetings: "Hi! How are you feeling today?"
   - For emotional sharing: "I hear you. That sounds really tough. Would you like to talk more about how that's affecting you?"
   - For crisis situations: "I'm here with you. You're not alone. Let's talk about what's happening."
   - Keep initial responses light and inviting
   - Gradually increase depth as the conversation progresses

3. Emotional Intelligence:
   - Acknowledge and validate feelings when they're expressed
   - Use natural empathetic language:
     * "I can understand why you'd feel that way"
     * "That sounds really difficult"
     * "It's okay to feel that way"
   - Show genuine care through attentive listening
   - Let the user lead the depth of the conversation
   - Use gentle pauses in responses (e.g., "Hmm... I can see why that would be challenging")

4. Therapeutic Approach:
   - Start with simple, open-ended questions
   - Build trust gradually
   - Allow the conversation to flow naturally
   - Offer deeper insights only when appropriate
   - Provide coping strategies when specifically requested
   - Use metaphors and analogies to explain concepts when helpful

5. Safety and Boundaries:
   - Recognize signs of crisis or severe distress
   - Provide appropriate resources when needed
   - Maintain professional boundaries while being warm
   - Avoid giving medical advice or diagnoses
   - Stay within therapeutic scope

Example Responses:
- For anxiety: "I understand you're feeling anxious. It's completely normal to feel this way. Would you like to explore what might be triggering these feelings?"
- For sadness: "I hear that you're going through a difficult time. It's okay to feel this way. Would you like to talk about what's been most challenging?"
- For stress: "That sounds overwhelming. Let's break this down together. What's feeling most pressing right now?"

Previous conversation:
${messageHistory.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}

User: ${userMessage}

Provide a response that matches the user's energy and emotional context. Keep it natural, warm, and professional.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.85,
            maxOutputTokens: 1024,
            stopSequences: ["User:"]
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
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
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Only speak if not muted
        if (!isMuted) {
          console.log("Speaking response:", aiResponse); // Debug log
          speechService.speak(aiResponse);
        }
        
        return aiResponse;
      }

      throw new Error('No valid response received');

    } catch (error) {
      console.error('Error:', error);
      const fallbackResponse = `I understand you're going through a difficult time. Let's focus on what's troubling you most right now. Would you like to explore some coping strategies together?`;
      if (!isMuted) {
        speechService.speak(fallbackResponse);
      }
      return fallbackResponse;
    }
  };

  const handleLocalMessage = async (message, isUser = true) => {
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

  return (
    <div className="chat-page">
      <Link to="/" className="back-button">Back to Home</Link>
      <ChatInterface 
        messages={messages} 
        onSendMessage={handleLocalMessage}
        isTyping={isTyping}
        isMuted={isMuted}
        onMuteToggle={setIsMuted}
      />
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

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
              <Route path="/" element={<LandingPage />} />
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