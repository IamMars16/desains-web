export const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });

export function depositRate(productId, quantity) {
  const q = Number(quantity);
  if (!Number.isInteger(q) || q < 1) throw new Error('La cantidad debe ser un número entero mayor que cero.');
  if (productId !== 'stickers') return 0.5;
  if (q <= 2) return 1;
  if (q === 12) return 0.5;
  return null;
}

export function quoteLine(product, quantity) {
  if (!product || !Number.isFinite(product.price) || product.price <= 0) throw new Error('El producto necesita un precio válido.');
  const q = Number(quantity);
  const rate = depositRate(product.id, q);
  const subtotal = Math.round(product.price * q * 100) / 100;
  return {
    subtotal,
    rate,
    deposit: rate === null ? null : Math.ceil(subtotal * rate * 100) / 100,
    requiresReview: rate === null
  };
}

export function earliestDate(leadDays = 2, now = new Date()) {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + Number(leadDays || 0));
  return d.toISOString().slice(0, 10);
}

export function canMoveStage(order, next) {
  const allowed = {
    quote: ['payment-review'],
    'payment-review': ['queued'],
    queued: ['design'],
    design: ['production'],
    production: ['ready'],
    ready: ['delivered'],
    delivered: []
  };
  if (!allowed[order.stage]?.includes(next)) return { ok: false, reason: 'Ese cambio no corresponde al flujo actual.' };
  if (next === 'queued' && !order.depositVerified) return { ok: false, reason: 'Primero se debe verificar el ingreso del adelanto.' };
  if (next === 'production' && !order.designApproved) return { ok: false, reason: 'El cliente debe aprobar el diseño vigente antes de producir.' };
  if (next === 'delivered' && Number(order.paid || 0) < Number(order.total || 0)) return { ok: false, reason: 'El saldo debe estar verificado antes de cerrar la entrega.' };
  return { ok: true };
}

export function normalize(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function parseOrderText(text, products) {
  const clean = normalize(text);
  const numbers = {un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,doce:12,docena:12};
  const quantityMatch = clean.match(/\b(\d{1,3}|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|doce|docena)\b/);
  const quantity = quantityMatch ? Number(quantityMatch[1]) || numbers[quantityMatch[1]] : null;
  const product = products.find(p => clean.includes(normalize(p.short)) || clean.includes(normalize(p.name)) || clean.includes(p.id));
  const specMatch = text.match(/(?:con|diseño|diseno|frase|personalización|personalizacion)\s*[:=]?\s+(.{3,})/i);
  return { productId: product?.id || null, quantity, specs: specMatch?.[1]?.trim() || '' };
}

export function makeReference(now = new Date(), random = Math.random) {
  const year = String(now.getFullYear()).slice(-2);
  const code = Math.floor(1000 + random() * 9000);
  return `AJ-${year}${code}`;
}
