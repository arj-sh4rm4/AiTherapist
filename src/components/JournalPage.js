import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const GUIDED_PROMPTS = [
  "How are you feeling today, and why?",
  "What's one thing that challenged you today?",
  "What are three things you're grateful for?",
  "What's something you're looking forward to?",
  "Describe a moment that made you smile today.",
  "What's something you'd like to improve about yourself?",
];

const JournalPage = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showEntriesList, setShowEntriesList] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [entryContent, setEntryContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { currentUser } = useAuth();

  const loadEntries = useCallback(async () => {
    try {
      const entriesRef = collection(db, 'journal_entries');
      const q = query(
        entriesRef,
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const loadedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEntries(loadedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowNewEntry(true);
    if (type === 'guided') {
      setCurrentPrompt(GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newEntry = {
        userId: currentUser.uid,
        type: selectedType,
        content: entryContent,
        prompt: currentPrompt,
        date: new Date().toISOString(),
      };

      console.log('Attempting to save entry:', newEntry);

      const docRef = await addDoc(collection(db, 'journal_entries'), newEntry);
      console.log('Entry saved with ID:', docRef.id);
      
      // Refresh entries
      await loadEntries();

      // Reset form
      setShowNewEntry(false);
      setEntryContent('');
      setSelectedType(null);
    } catch (error) {
      console.error('Detailed error saving entry:', error);
      alert(`Failed to save entry: ${error.message}`);
    }
  };

  const handleDeleteEntry = async (entryId, e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'journal_entries', entryId));
        setEntries(entries.filter(entry => entry.id !== entryId));
        setShowViewModal(false);
        setSelectedEntry(null);
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry: ' + error.message);
      }
    }
  };

  const ViewEntryModal = ({ entry, onClose }) => {
    if (!entry) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{entry.type === 'guided' ? 'Guided Entry' : 'Free Writing'}</h3>
            <button onClick={onClose} className="close-btn">&times;</button>
          </div>
          <div className="modal-body">
            <div className="entry-date">
              {new Date(entry.date).toLocaleDateString()} at{' '}
              {new Date(entry.date).toLocaleTimeString()}
            </div>
            {entry.prompt && (
              <div className="entry-prompt">
                <strong>Prompt:</strong> {entry.prompt}
              </div>
            )}
            <div className="entry-content">
              {entry.content}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EntriesListView = () => (
    <div className="entries-view">
      <div className="entries-header">
        <div className="entries-header-top">
          <h2>Your Journal Entries</h2>
          <button 
            className="back-to-options-btn"
            onClick={() => setShowEntriesList(false)}
          >
            Back to Journal Options
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading entries...</div>
      ) : entries.length === 0 ? (
        <div className="no-entries">
          <p>No entries yet. Start journaling!</p>
          <button 
            className="start-journaling-btn"
            onClick={() => setShowEntriesList(false)}
          >
            Create New Entry
          </button>
        </div>
      ) : (
        <div className="entries-grid">
          {entries.map(entry => (
            <div 
              key={entry.id} 
              className="entry-card"
              onClick={() => {
                setSelectedEntry(entry);
                setShowViewModal(true);
              }}
            >
              <div className="entry-date">
                {new Date(entry.date).toLocaleDateString()} at{' '}
                {new Date(entry.date).toLocaleTimeString()}
              </div>
              <button
                className="delete-entry-btn"
                onClick={(e) => handleDeleteEntry(entry.id, e)}
                aria-label="Delete entry"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="journal-container">
      <Link to="/" className="back-button">Back to Home</Link>
      
      <div className="journal-header">
        <h1>Journal Space</h1>
      </div>

      {showEntriesList ? (
        <EntriesListView />
      ) : !showNewEntry ? (
        <div className="entry-types">
          <button 
            className="entry-type-btn"
            onClick={() => handleTypeSelect('free')}
          >
            <span>📝</span>
            <span>Free Write</span>
            <p className="type-description">Express your thoughts freely</p>
          </button>
          <button 
            className="entry-type-btn"
            onClick={() => handleTypeSelect('guided')}
          >
            <span>🎯</span>
            <span>Guided Prompt</span>
            <p className="type-description">Respond to thought-provoking questions</p>
          </button>
          <button 
            className="entry-type-btn"
            onClick={() => setShowEntriesList(true)}
          >
            <span>📚</span>
            <span>View & Edit Entries</span>
            <p className="type-description">Browse and manage your journal entries</p>
          </button>
        </div>
      ) : (
        <div className="entry-form-container">
          <h2>{selectedType === 'free' ? 'Free Writing' : 'Guided Prompt'}</h2>
          
          <form onSubmit={handleSubmit} className="entry-form">
            {selectedType === 'guided' && (
              <div className="prompt-container">
                <p className="prompt-text">{currentPrompt}</p>
                <button 
                  type="button" 
                  className="new-prompt-btn"
                  onClick={() => setCurrentPrompt(GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)])}
                >
                  Try Another Prompt
                </button>
              </div>
            )}
            
            <textarea
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder={selectedType === 'free' 
                ? "Start writing your thoughts..." 
                : "Write your response here..."}
              rows="10"
              className="entry-textarea"
            />
            
            <div className="form-buttons">
              <button 
                type="button" 
                onClick={() => setShowNewEntry(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={!entryContent.trim()}
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {showViewModal && (
        <ViewEntryModal 
          entry={selectedEntry} 
          onClose={() => {
            setShowViewModal(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
};

export default JournalPage; 