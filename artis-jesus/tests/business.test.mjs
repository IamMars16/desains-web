import test from 'node:test';
import assert from 'node:assert/strict';
import { depositRate, quoteLine, canMoveStage, parseOrderText, makeReference } from '../dist/assets/business.js';
import { readFile } from 'node:fs/promises';
import { NeuralIntent } from '../dist/assets/neural.js';

test('aplica las reglas de adelanto sin contradicciones', () => {
  assert.equal(depositRate('taza', 2), 0.5);
  assert.equal(depositRate('stickers', 1), 1);
  assert.equal(depositRate('stickers', 2), 1);
  assert.equal(depositRate('stickers', 12), 0.5);
  assert.equal(depositRate('stickers', 6), null);
  assert.deepEqual(quoteLine({id:'taza', price:25}, 2), {subtotal:50, rate:0.5, deposit:25, requiresReview:false});
});

test('bloquea producción sin aprobación del diseño vigente', () => {
  assert.equal(canMoveStage({stage:'design', designApproved:false}, 'production').ok, false);
  assert.equal(canMoveStage({stage:'design', designApproved:true}, 'production').ok, true);
});

test('interpreta un pedido breve', () => {
  const result = parseOrderText('Quiero 2 tazas con la frase Feliz cumpleaños', [{id:'taza',short:'Tazas',name:'Taza personalizada'}]);
  assert.equal(result.productId, 'taza');
  assert.equal(result.quantity, 2);
  assert.match(result.specs, /Feliz cumpleaños/i);
  assert.match(makeReference(new Date('2026-10-22'), () => 0), /^AJ-26\d{4}$/);
});

test('la red neuronal clasifica intenciones conocidas', async () => {
  const model = JSON.parse(await readFile(new URL('../dist/assets/intent-model.json', import.meta.url), 'utf8'));
  const neural = new NeuralIntent(model);
  assert.equal(neural.predict('quiero hacer un pedido').intent, 'order');
  assert.equal(neural.predict('cómo va mi pedido').intent, 'status');
  assert.equal(neural.predict('cuánto debo abonar').intent, 'payment');
});
