import { normalize } from './business.js';

export function tokens(value = '') {
  return normalize(value).match(/[a-z0-9]+/g) || [];
}

export class NeuralIntent {
  constructor(model) {
    this.model = model;
    this.index = new Map(model.vocabulary.map((word, index) => [word, index]));
  }

  predict(text) {
    const model = this.model;
    const input = Array(model.vocabulary.length).fill(0);
    let known = 0;
    for (const token of new Set(tokens(text))) {
      const index = this.index.get(token);
      if (index !== undefined) {
        input[index] = 1;
        known += 1;
      }
    }
    if (!known) return { intent: 'unknown', confidence: 0 };
    const hidden = model.b1.map((bias, j) => Math.tanh(bias + input.reduce((sum, value, i) => sum + value * model.w1[i][j], 0)));
    const logits = model.b2.map((bias, k) => bias + hidden.reduce((sum, value, j) => sum + value * model.w2[j][k], 0));
    const peak = Math.max(...logits);
    const exponentials = logits.map(value => Math.exp(value - peak));
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    const probabilities = exponentials.map(value => value / total);
    const best = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[best];
    return { intent: confidence >= 0.56 ? model.labels[best] : 'unknown', confidence };
  }
}

export async function loadNeuralIntent(path = './assets/intent-model.json') {
  const response = await fetch(path);
  if (!response.ok) throw new Error('No se pudo cargar el modelo de intenciones.');
  return new NeuralIntent(await response.json());
}
