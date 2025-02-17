import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

class TherapyModel {
  constructor() {
    this.model = null;
    this.encoder = null;
    this.responses = therapeuticResponses; // from your existing responses
    this.loadModel();
  }

  async loadModel() {
    this.encoder = await use.load();
  }

  async getResponse(userMessage, context) {
    const input = await this.encoder.embed([userMessage]);
    
    // Compare with pre-defined responses using cosine similarity
    const responses = Object.values(this.responses)
      .flat()
      .map(r => (typeof r === 'object' ? Object.values(r) : r))
      .flat();

    const responseEmbeddings = await this.encoder.embed(responses);
    
    const similarities = tf.matMul(input, responseEmbeddings.transpose());
    const bestMatchIndex = similarities.argMax(1).dataSync()[0];
    
    return responses[bestMatchIndex];
  }
}

export const therapyModel = new TherapyModel(); 