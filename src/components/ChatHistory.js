import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const ChatHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadConversations();
  }, [currentUser]);

  const loadConversations = async () => {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('lastMessageTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const loadedConversations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setConversations(loadedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-history">
      <h2>Chat History</h2>
      {loading ? (
        <div className="loading">Loading conversations...</div>
      ) : (
        <div className="conversations-list">
          {conversations.map(conv => (
            <div key={conv.id} className="conversation-card">
              <div className="conversation-date">
                {new Date(conv.lastMessageTime).toLocaleDateString()}
              </div>
              <div className="conversation-messages">
                {conv.messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === 'user' ? 'user' : 'therapist'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory; 