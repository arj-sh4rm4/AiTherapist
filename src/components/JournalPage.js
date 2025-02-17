import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [selectedType, setSelectedType] = useState(null);
  const [entryContent, setEntryContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowNewEntry(true);
    if (type === 'guided') {
      setCurrentPrompt(GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save entry to storage/database
    console.log({
      type: selectedType,
      content: entryContent,
      prompt: currentPrompt,
      date: new Date().toISOString()
    });
    setShowNewEntry(false);
    setEntryContent('');
    setSelectedType(null);
  };

  return (
    <div className="journal-container">
      <Link to="/" className="back-button">Back to Home</Link>
      
      <div className="journal-header">
        <h1>Journal Space</h1>
      </div>

      {!showNewEntry ? (
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
    </div>
  );
};

export default JournalPage; 