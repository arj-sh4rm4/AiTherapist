import { NlpManager } from 'node-nlp';

class TherapyNLP {
  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
    this.initialize();
  }

  async initialize() {
    // Train for anxiety responses
    this.manager.addDocument('en', 'feeling anxious', 'anxiety');
    this.manager.addDocument('en', 'panic attack', 'anxiety.severe');
    // Add more training data...

    // Add responses
    this.manager.addAnswer(
      'en',
      'anxiety',
      "I understand you're feeling anxious. Can you tell me more about what's triggering these feelings?"
    );
    this.manager.addAnswer(
      'en',
      'anxiety.severe',
      "It sounds like you're experiencing intense anxiety. Let's try a grounding exercise together."
    );
    
    await this.manager.train();
  }

  async getResponse(userMessage) {
    const result = await this.manager.process('en', userMessage);
    return result.answer || "I'm here to listen. Can you tell me more about what you're experiencing?";
  }
}

export const therapyNLP = new TherapyNLP();