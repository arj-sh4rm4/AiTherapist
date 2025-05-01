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

  async validate(model, valLoader, device) {
    model.eval(); // Set model to evaluation mode
    let valLoss = 0;
    let correct = 0;
    let total = 0;
    
    // Disable gradient computation
    for (const [inputs, labels] of valLoader) {
      inputs = inputs.to(device);
      labels = labels.to(device);
      
      // Forward pass
      const outputs = model(inputs);
      const loss = criterion(outputs, labels);
      
      // Calculate statistics
      valLoss += loss.item();
      const [_, predicted] = outputs.max(1);
      total += labels.size(0);
      correct += predicted.eq(labels).sum().item();
    }
    
    // Calculate average loss and accuracy
    valLoss = valLoss / valLoader.length;
    const valAcc = 100. * correct / total;
    
    return [valLoss, valAcc];
  }
}

export const therapyModel = new TherapyModel(); 