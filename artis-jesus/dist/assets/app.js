import { PEN, canMoveStage, earliestDate, makeReference, normalize, parseOrderText, quoteLine } from './business.js';
import { loadNeuralIntent } from './neural.js';

const config = window.ARTIS_CONFIG;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const stageLabels = { quote:'Revisar cotización', 'payment-review':'Verificar adelanto', queued:'Por atender', design:'Diseño y aprobación', production:'En producción', ready:'Listo para entrega', delivered:'Entregado' };
const deliveryLabels = { pickup:'Recojo coordinado', delivery:'Delivery local', agency:'Envío por agencia' };
const storageKey = 'artis-jesus-orders-v1';
const chatKey = 'artis-jesus-venus-chat-v1';
const today = new Date().toISOString().slice(0, 10);

const demoOrders = [
  { ref:'AJ-2401', customer:'María P.', phone:'999 000 001', productId:'taza', product:'Taza personalizada', quantity:2, specs:'Dos nombres, flores rosadas y la frase “Siempre juntas”.', date:today, delivery:'pickup', total:50, deposit:25, paid:25, depositVerified:true, designApproved:true, designVersion:2, stage:'production', createdAt:Date.now()-172800000, source:'demo' },
  { ref:'AJ-2402', customer:'Carlos R.', phone:'999 000 002', productId:'termo', product:'Termo personalizado', quantity:1, specs:'Logo del equipo en negro y rojo.', date:today, delivery:'delivery', total:45, deposit:22.5, paid:0, depositVerified:false, designApproved:false, designVersion:0, stage:'payment-review', createdAt:Date.now()-86400000, source:'demo' },
  { ref:'AJ-2403', customer:'Ana L.', phone:'999 000 003', productId:'cuadro', product:'Cuadro personalizado', quantity:1, specs:'Fotografía familiar, formato horizontal y fecha especial.', date:today, delivery:'pickup', total:40, deposit:20, paid:20, depositVerified:true, designApproved:false, designVersion:1, stage:'design', createdAt:Date.now()-43200000, source:'demo' }
];

let orders = loadOrders();
let selectedCategory = 'Todos';
let selectedProductId = 'taza';
let builderStep = 1;
let builderPrefill = {};
let neural = null;
let neuralMeta = null;
let lastPrediction = null;
let toastTimer;

function loadOrders() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(stored) && stored.length ? stored : structuredClone(demoOrders);
  } catch { return structuredClone(demoOrders); }
}

function saveOrders() {
  localStorage.setItem(storageKey, JSON.stringify(orders));
}

function productById(id) { return config.products.find(product => product.id === id); }

function productSVG(id) {
  const common = 'fill="none" stroke="#7b171d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const art = {
    taza: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de una taza personalizada"><ellipse cx="83" cy="42" rx="48" ry="12" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><path d="M35 42v76c0 24 96 24 96 0V42" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><path d="M131 62c38-8 40 54 2 48" ${common}/><path d="M65 77c12-14 25-10 25 3 0-13 15-17 25-3-1 20-25 30-25 30S67 97 65 77Z" fill="#d16066" stroke="none"/></svg>`,
    tomatodo: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de un tomatodo personalizado"><path d="M67 24h46v19l10 13v88c0 12-66 12-66 0V56l10-13Z" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><path d="M70 24v-8h40v8M58 68h64M58 131h64" ${common}/><path d="m76 88 14 14 23-26" stroke="#d16066" stroke-width="5" fill="none"/></svg>`,
    termo: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de un termo personalizado"><path d="M66 28h48l7 19v103H59V47Z" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><path d="M65 28h50l-6-13H71ZM59 49h62M72 74h36" ${common}/><text x="90" y="118" text-anchor="middle" fill="#d16066" font-size="24" font-family="serif" font-style="italic">AJ</text></svg>`,
    cuadro: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de un cuadro personalizado"><rect x="33" y="29" width="114" height="125" rx="3" fill="#8e4145"/><rect x="43" y="39" width="94" height="105" fill="#fff9f4"/><circle cx="91" cy="77" r="19" fill="#f4b999"/><path d="m50 132 28-32 20 20 17-17 16 29Z" fill="#e1c1c4"/><path d="M43 39h94v105H43z" ${common}/></svg>`,
    llavero: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de un llavero personalizado"><circle cx="90" cy="50" r="27" ${common}/><circle cx="90" cy="50" r="15" ${common}/><path d="M78 75v18" ${common}/><path d="M90 84c-37 0-49 27-28 48l28 28 28-28c21-21 9-48-28-48Z" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><text x="90" y="128" text-anchor="middle" fill="#d16066" font-size="22" font-family="serif">A</text></svg>`,
    stickers: `<svg viewBox="0 0 180 180" role="img" aria-label="Ilustración de stickers personalizados"><path d="M38 30h105v125H38z" fill="#fff9f4" stroke="#7b171d" stroke-width="2.2"/><circle cx="72" cy="67" r="21" fill="#ee94a0"/><path d="M106 48c19-6 29 18 11 29-16 9-28-16-11-29Z" fill="#f4b999"/><path d="M58 111c13-16 28-7 27 7 0-14 16-23 28-7-3 23-28 34-28 34s-25-11-27-34Z" fill="#d16066"/><path d="m106 97 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#e1c1c4"/></svg>`
  };
  return art[id] || art.taza;
}

function renderProducts() {
  const query = normalize($('#catalog-search')?.value || '');
  const visible = config.products.filter(product => (selectedCategory === 'Todos' || product.category === selectedCategory) && (!query || normalize(product.name).includes(query)));
  $('#product-grid').innerHTML = visible.length ? visible.map(product => `
    <article class="product-card">
      <div class="product-visual tone-${escapeHTML(product.tone)}">
        ${product.popular ? '<span class="product-badge">MÁS ELEGIDO</span>' : ''}
        ${productSVG(product.id)}
        <button class="quick-add" data-product="${escapeHTML(product.id)}" aria-label="Personalizar ${escapeHTML(product.short)}">＋</button>
      </div>
      <div class="product-info"><div><h3>${escapeHTML(product.short)}</h3><p>${escapeHTML(product.category)} · Personalizable</p></div><strong>Desde ${PEN.format(product.price)}</strong></div>
    </article>`).join('') : '<p>No encontramos productos con esa búsqueda.</p>';
  $$('[data-product]', $('#product-grid')).forEach(button => button.addEventListener('click', () => openBuilder(button.dataset.product)));
}

function setupCatalog() {
  renderProducts();
  $$('.category-tabs button').forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    $$('.category-tabs button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', String(item === button)); });
    renderProducts();
  }));
  $('#catalog-search').addEventListener('input', renderProducts);
  $$('[data-focus-catalog]').forEach(button => button.addEventListener('click', () => { location.hash = 'catalogo'; setTimeout(() => $('#catalog-search').focus(), 400); }));
}

function renderBuilderProducts() {
  $('#builder-products').innerHTML = config.products.map(product => `<button type="button" class="builder-product ${selectedProductId === product.id ? 'selected' : ''}" data-builder-product="${escapeHTML(product.id)}"><span>${productSVG(product.id)}</span><div><b>${escapeHTML(product.short)}</b><small>Desde ${PEN.format(product.price)}</small></div></button>`).join('');
  $$('[data-builder-product]').forEach(button => button.addEventListener('click', () => { selectedProductId = button.dataset.builderProduct; renderBuilderProducts(); updateQuantityHelp(); }));
}

function updateQuantityHelp() {
  const q = Number($('#builder-quantity').value || 1);
  if (selectedProductId === 'stickers' && q <= 2) $('#quantity-help').textContent = 'Para 1 o 2 hojas A4 se solicita el 100 % para comenzar.';
  else if (selectedProductId === 'stickers' && q === 12) $('#quantity-help').textContent = 'Para 12 hojas A4 se solicita el 50 % para comenzar.';
  else if (selectedProductId === 'stickers') $('#quantity-help').textContent = 'Esta cantidad requiere que el encargado confirme el adelanto.';
  else $('#quantity-help').textContent = 'En pedidos habituales se solicita el 50 % para comenzar.';
}

function openBuilder(productId = 'taza', prefill = {}) {
  selectedProductId = productId || 'taza';
  builderPrefill = prefill;
  builderStep = 1;
  $('#builder-form').reset();
  $('#builder-quantity').value = prefill.quantity || 1;
  $('#builder-specs').value = prefill.specs || '';
  $('#builder-date').min = earliestDate(config.leadDays);
  $('#builder-date').value = prefill.date || earliestDate(config.leadDays + 2);
  $('#date-help').textContent = `Fecha mínima orientativa: ${formatDate(earliestDate(config.leadDays))}.`;
  renderBuilderProducts();
  updateQuantityHelp();
  renderBuilderStep();
  $('#builder-dialog').showModal();
  document.body.classList.add('locked');
}

function renderBuilderStep() {
  $$('.builder-step').forEach(step => step.classList.toggle('active', Number(step.dataset.step) === builderStep));
  $$('[data-progress]').forEach(item => { const number = Number(item.dataset.progress); item.classList.toggle('active', number === builderStep); item.classList.toggle('done', number < builderStep); });
  $('#builder-back').hidden = builderStep === 1;
  $('#builder-next').hidden = builderStep === 3;
  $('#builder-submit').hidden = builderStep !== 3;
  $('#builder-step-label').textContent = ['','Producto','Personalización','Confirmación'][builderStep];
  if (builderStep === 3) renderOrderSummary();
}

function validateBuilderStep() {
  if (builderStep === 1) {
    const quantity = Number($('#builder-quantity').value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) { toast('Indica una cantidad entre 1 y 500.'); $('#builder-quantity').focus(); return false; }
  }
  if (builderStep === 2) {
    if (!$('#builder-specs').value.trim()) { toast('Describe la personalización que necesitas.'); $('#builder-specs').focus(); return false; }
    if (!$('#builder-date').value || $('#builder-date').value < $('#builder-date').min) { toast('Elige una fecha válida a partir del plazo mínimo.'); $('#builder-date').focus(); return false; }
    const file = $('#builder-file').files[0];
    if (file && file.size > 4 * 1024 * 1024) { toast('La referencia supera 4 MB.'); return false; }
  }
  return true;
}

function currentQuote() {
  return quoteLine(productById(selectedProductId), Number($('#builder-quantity').value));
}

function renderOrderSummary() {
  const product = productById(selectedProductId);
  const quote = currentQuote();
  const delivery = $('#builder-delivery').value;
  const needsTransportReview = delivery !== 'pickup';
  const depositText = quote.deposit === null ? 'Por confirmar' : PEN.format(quote.deposit);
  $('#order-summary').innerHTML = `
    <div class="summary-row"><span>Producto</span><b>${escapeHTML(product.name)}</b></div>
    <div class="summary-row"><span>Cantidad</span><b>${escapeHTML($('#builder-quantity').value)}</b></div>
    <div class="summary-row"><span>Fecha solicitada</span><b>${escapeHTML(formatDate($('#builder-date').value))}</b></div>
    <div class="summary-row"><span>Entrega</span><b>${escapeHTML(deliveryLabels[delivery])}</b></div>
    <div class="summary-row total"><span>Subtotal referencial</span><b>${PEN.format(quote.subtotal)}</b></div>
    <div class="summary-row"><span>Adelanto aplicable</span><b>${depositText}</b></div>
    ${(quote.requiresReview || needsTransportReview) ? `<div class="summary-review">${quote.requiresReview ? 'La cantidad de stickers requiere validar el porcentaje de adelanto. ' : ''}${needsTransportReview ? 'El costo y las condiciones de transporte se cotizan antes de confirmar.' : ''}</div>` : ''}`;
}

function submitBuilder(event) {
  event.preventDefault();
  if (!$('#builder-name').value.trim() || !$('#builder-phone').value.trim() || !$('#builder-agree').checked) { toast('Completa tus datos y confirma la revisión.'); return; }
  const product = productById(selectedProductId);
  const quote = currentQuote();
  const reference = makeReference();
  const file = $('#builder-file').files[0];
  const order = {
    ref: reference,
    customer: $('#builder-name').value.trim(),
    phone: $('#builder-phone').value.trim(),
    productId: product.id,
    product: product.name,
    quantity: Number($('#builder-quantity').value),
    specs: $('#builder-specs').value.trim(),
    date: $('#builder-date').value,
    delivery: $('#builder-delivery').value,
    referenceFile: file?.name || '',
    total: quote.subtotal,
    deposit: quote.deposit,
    paid: 0,
    depositVerified: false,
    designApproved: false,
    designVersion: 0,
    stage: 'quote',
    createdAt: Date.now(),
    source: 'web'
  };
  orders.unshift(order);
  saveOrders();
  closeBuilder();
  addBotMessage(`Tu solicitud ${reference} quedó reunida. El equipo revisará disponibilidad, fecha y precio antes de pedirte cualquier pago. Puedes copiar el código para consultar su avance.`, [{label:'Ver seguimiento', action:'track', value:reference},{label:'Continuar por WhatsApp', action:'whatsapp', value:reference}]);
  openChat();
  renderAdmin();
  toast(`Solicitud ${reference} registrada.`);
}

function closeBuilder() { $('#builder-dialog').close(); document.body.classList.remove('locked'); }

function setupBuilder() {
  $$('[data-open-builder]').forEach(button => button.addEventListener('click', () => openBuilder()));
  $('.close-builder').addEventListener('click', closeBuilder);
  $('#builder-dialog').addEventListener('close', () => document.body.classList.remove('locked'));
  $('#builder-next').addEventListener('click', () => { if (validateBuilderStep()) { builderStep += 1; renderBuilderStep(); } });
  $('#builder-back').addEventListener('click', () => { builderStep -= 1; renderBuilderStep(); });
  $('#builder-quantity').addEventListener('input', updateQuantityHelp);
  $('#builder-file').addEventListener('change', () => { const file = $('#builder-file').files[0]; $('.upload-field b').textContent = file ? file.name : 'Adjuntar una referencia'; });
  $('#builder-form').addEventListener('submit', submitBuilder);
}

function initialMessages() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(chatKey));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return [{ role:'bot', text:'¡Hola! Soy Venus ✦\nPuedo mostrarte el catálogo, ayudarte a preparar un pedido o consultar su estado. ¿Qué necesitas hoy?' }];
}

let chatMessages = initialMessages();

function saveMessages() { sessionStorage.setItem(chatKey, JSON.stringify(chatMessages.slice(-40))); }

function renderMessages() {
  const box = $('#chat-messages');
  box.innerHTML = chatMessages.map((message, index) => `<div class="message ${message.role === 'user' ? 'user' : 'bot'}"><small>${message.role === 'user' ? 'TÚ' : 'VENUS'}</small>${escapeHTML(message.text)}${message.actions?.length ? `<div class="message-actions">${message.actions.map(action => `<button data-message-index="${index}" data-action="${escapeHTML(action.action)}" data-value="${escapeHTML(action.value || '')}">${escapeHTML(action.label)}</button>`).join('')}</div>` : ''}</div>`).join('');
  box.scrollTop = box.scrollHeight;
}

function addUserMessage(text) { chatMessages.push({role:'user', text}); saveMessages(); renderMessages(); }
function addBotMessage(text, actions = []) { chatMessages.push({role:'bot', text, actions}); saveMessages(); renderMessages(); }

function openChat() {
  $('#chat-drawer').classList.add('open');
  $('#chat-drawer').setAttribute('aria-hidden','false');
  $('#drawer-backdrop').hidden = false;
  $('.venus-launcher').hidden = true;
  document.body.classList.add('locked');
  setTimeout(() => $('#chat-input').focus(), 250);
}

function closeChat() {
  $('#chat-drawer').classList.remove('open');
  $('#chat-drawer').setAttribute('aria-hidden','true');
  $('#drawer-backdrop').hidden = true;
  $('.venus-launcher').hidden = false;
  document.body.classList.remove('locked');
}

function classifierFallback(text) {
  const clean = normalize(text);
  const sets = { order:['pedido','comprar','quiero'], catalog:['catalogo','producto','foto','modelo'], status:['estado','avance','listo','como va'], payment:['pago','abono','adelanto','yape'], delivery:['delivery','recojo','agencia','envio'], human:['persona','encargado','asesor'], cancel:['cancelar','anular','reembolso'], thanks:['gracias'], greeting:['hola','buenas'] };
  const found = Object.entries(sets).find(([,words]) => words.some(word => clean.includes(word)));
  return {intent: found?.[0] || 'unknown', confidence: found ? .58 : 0};
}

async function venusReply(text) {
  const prediction = neural ? neural.predict(text) : classifierFallback(text);
  lastPrediction = prediction;
  $('#neural-label').textContent = `Última intención: ${intentName(prediction.intent)} · ${Math.round(prediction.confidence * 100)} %`;
  const parsed = parseOrderText(text, config.products);
  const reference = text.toUpperCase().match(/AJ-[A-Z0-9-]{4,12}/)?.[0];
  const intent = prediction.intent;
  if (intent === 'greeting') return addBotMessage('¡Hola! Me alegra acompañarte. Puedo mostrarte productos, preparar una solicitud o revisar el estado de un pedido.', [{label:'Ver catálogo',action:'catalog'},{label:'Crear pedido',action:'builder'}]);
  if (intent === 'catalog') return addBotMessage(`Tenemos ${config.products.map(product => product.short.toLowerCase()).join(', ')}. Todo puede llevar nombres, frases, colores o imágenes.`, config.products.slice(0,3).map(product => ({label:product.short,action:'builder',value:product.id})));
  if (intent === 'order') {
    const product = productById(parsed.productId || 'taza');
    const detail = parsed.productId ? `Entendí: ${parsed.quantity || 'cantidad por definir'} × ${product.name}${parsed.specs ? `, con “${parsed.specs}”` : ''}.` : 'Voy a reunir producto, cantidad, personalización, fecha y entrega.';
    return addBotMessage(`${detail}\nRevisarás el resumen antes de enviarlo.`, [{label:'Completar pedido',action:'builder',value:product.id, prefill:parsed}]);
  }
  if (intent === 'status') {
    if (reference) {
      const order = orders.find(item => item.ref.toUpperCase() === reference);
      return order ? addBotMessage(`${order.ref}: ${stageLabels[order.stage]}. Fecha solicitada: ${formatDate(order.date)}.`, [{label:'Ver seguimiento',action:'track',value:order.ref}]) : addBotMessage(`No encuentro ${reference} en este navegador. Verifica el código o pide ayuda al encargado.`, [{label:'Hablar con el encargado',action:'whatsapp'}]);
    }
    return addBotMessage('Escribe el código del pedido, por ejemplo AJ-2401, y te mostraré la etapa registrada.', [{label:'Probar AJ-2401',action:'prompt',value:'Estado de AJ-2401'}]);
  }
  if (intent === 'payment') return addBotMessage('En pedidos habituales se solicita el 50 % para iniciar y el 50 % restante al recojo o antes del despacho. Para 1 o 2 hojas A4 de stickers se solicita el 100 %; para 12 hojas, el 50 %. Otras cantidades se validan en la cotización. Una captura se recibe como evidencia, pero el encargado confirma el ingreso real.');
  if (intent === 'delivery') return addBotMessage('Puedes elegir recojo coordinado, delivery local o envío por agencia. Delivery y agencia requieren confirmar destino, costo y datos del destinatario antes de la cotización final.');
  if (intent === 'human') return addBotMessage('Claro. Prepararé tu consulta para que la revise el encargado de Artis Jesús.', [{label:'Continuar por WhatsApp',action:'whatsapp'}]);
  if (intent === 'cancel') return addBotMessage('La cancelación o modificación se revisa según el avance del pedido, los materiales usados y los pagos aplicados. El encargado debe evaluarla para evitar cobros o devoluciones incorrectas.', [{label:'Solicitar revisión',action:'whatsapp'}]);
  if (intent === 'thanks') return addBotMessage('Con mucho gusto ✦ Aquí estaré cuando quieras crear algo especial.');
  if (intent === 'stop') return addBotMessage('Entendido. No enviaré más respuestas automáticas en esta conversación. Puedes volver a abrir el chat cuando lo necesites.');
  return addBotMessage('Quiero entenderte bien. Puedo ayudarte con catálogo, pedido, adelanto, entrega o seguimiento. También puedes pedir atención del encargado.', [{label:'Ver catálogo',action:'catalog'},{label:'Crear pedido',action:'builder'},{label:'Atención humana',action:'whatsapp'}]);
}

function intentName(intent) { return ({greeting:'saludo',catalog:'catálogo',order:'pedido',status:'seguimiento',payment:'pago',human:'atención humana',cancel:'cambio o cancelación',delivery:'entrega',thanks:'agradecimiento',stop:'detener',unknown:'por aclarar'})[intent] || intent; }

async function sendChat(text) {
  const value = text.trim();
  if (!value) return;
  addUserMessage(value);
  $('#chat-input').value = '';
  $('#chat-input').style.height = '';
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>'; $('#chat-messages').append(typing); $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  await sleep(420);
  typing.remove();
  await venusReply(value);
}

function setupChat() {
  renderMessages();
  $$('[data-open-chat]').forEach(button => button.addEventListener('click', openChat));
  $('.close-chat').addEventListener('click', closeChat);
  $('#drawer-backdrop').addEventListener('click', closeChat);
  $('#chat-form').addEventListener('submit', event => { event.preventDefault(); sendChat($('#chat-input').value); });
  $('#chat-input').addEventListener('input', event => { event.target.style.height = 'auto'; event.target.style.height = `${Math.min(event.target.scrollHeight,96)}px`; });
  $('#chat-suggestions').addEventListener('click', event => { const button = event.target.closest('[data-prompt]'); if (button) sendChat(button.dataset.prompt); });
  $('#chat-file').addEventListener('change', () => {
    const file = $('#chat-file').files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast('El archivo supera 4 MB.'); $('#chat-file').value = ''; return; }
    $('#file-preview').hidden = false; $('#file-preview').textContent = `Referencia lista: ${file.name}`;
    addBotMessage('Recibí el nombre del archivo como referencia de esta demostración. En el sistema conectado, el archivo se guarda junto al pedido y su versión.');
  });
  $('#chat-messages').addEventListener('click', event => {
    const button = event.target.closest('[data-action]'); if (!button) return;
    const message = chatMessages[Number(button.dataset.messageIndex)];
    const action = message?.actions?.find(item => item.action === button.dataset.action && String(item.value || '') === button.dataset.value);
    handleAction(button.dataset.action, button.dataset.value, action?.prefill);
  });
  $('#neural-info').addEventListener('click', () => $('#info-dialog').showModal());
  $('.close-info').addEventListener('click', () => $('#info-dialog').close());
}

function handleAction(action, value, prefill) {
  if (action === 'builder') { closeChat(); setTimeout(() => openBuilder(value || 'taza', prefill || {}), 180); }
  if (action === 'catalog') { closeChat(); location.hash = 'catalogo'; }
  if (action === 'track') { closeChat(); showTracking(value); location.hash = 'seguimiento'; }
  if (action === 'prompt') sendChat(value);
  if (action === 'whatsapp') sendWhatsApp(value);
}

function formatDate(value) {
  if (!value) return 'Por confirmar';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short',year:'numeric'}).format(date);
}

function showTracking(code) {
  const reference = String(code || '').trim().toUpperCase();
  $('#tracking-code').value = reference;
  const order = orders.find(item => item.ref.toUpperCase() === reference);
  if (!order) { $('#tracking-error').textContent = 'No encontramos ese código en este navegador.'; $('#tracking-result').hidden = true; return false; }
  $('#tracking-error').textContent = '';
  const groups = [
    {label:'Registrado',stages:['quote','payment-review']},
    {label:'Por atender',stages:['queued']},
    {label:'Diseño',stages:['design']},
    {label:'Producción',stages:['production']},
    {label:order.stage === 'delivered' ? 'Entregado' : 'Listo',stages:['ready','delivered']}
  ];
  const activeIndex = Math.max(0, groups.findIndex(group => group.stages.includes(order.stage)));
  $('#tracking-result').innerHTML = `<div class="track-head"><div><span class="eyebrow">${escapeHTML(order.ref)}</span><h3>${escapeHTML(order.quantity)} × ${escapeHTML(order.product)}</h3><p>A nombre de ${escapeHTML(order.customer)} · Fecha solicitada ${escapeHTML(formatDate(order.date))}</p></div><span class="track-pill">${escapeHTML(stageLabels[order.stage])}</span></div><div class="timeline">${groups.map((group,index) => `<div class="timeline-step ${index < activeIndex ? 'done' : index === activeIndex ? 'active' : ''}">${escapeHTML(group.label)}</div>`).join('')}</div>`;
  $('#tracking-result').hidden = false;
  return true;
}

function setupTracking() {
  $('#tracking-form').addEventListener('submit', event => { event.preventDefault(); showTracking($('#tracking-code').value); });
  $('[data-demo-code]').addEventListener('click', () => showTracking('AJ-2401'));
}

function sendWhatsApp(reference = '') {
  const order = orders.find(item => item.ref === reference);
  const text = order ? `Hola, quisiera continuar con mi solicitud ${order.ref} de ${order.quantity} × ${order.product}.` : 'Hola, quisiera información para realizar un pedido personalizado en Artis Jesús.';
  if (config.whatsapp) window.open(`https://wa.me/${String(config.whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  else navigator.clipboard?.writeText(text).then(() => toast('Mensaje copiado. El número oficial de WhatsApp aún debe configurarse.')).catch(() => toast('El número oficial de WhatsApp aún debe configurarse.'));
}

function laneFor(stage) {
  if (['quote','payment-review'].includes(stage)) return 'review';
  if (['queued','design'].includes(stage)) return 'attention';
  if (stage === 'production') return 'production';
  return 'delivery';
}

function renderAdmin() {
  const search = normalize($('#admin-search')?.value || '');
  const visible = orders.filter(order => !search || normalize(`${order.ref} ${order.customer} ${order.product}`).includes(search));
  const pending = orders.filter(order => order.stage !== 'delivered');
  const totalPaid = orders.reduce((sum, order) => sum + Number(order.paid || 0), 0);
  $('#admin-stats').innerHTML = [
    ['Pedidos abiertos',pending.length,'En seguimiento','▦'],
    ['Por atender',orders.filter(order=>laneFor(order.stage)==='attention').length,'Adelanto verificado','↗'],
    ['Revisar pagos',orders.filter(order=>order.stage==='payment-review').length,'Comprobantes por validar','◈'],
    ['Abonos registrados',PEN.format(totalPaid),'Datos de demostración','✓']
  ].map(([label,value,note,icon]) => `<article class="admin-stat"><small>${label}</small><strong>${value}</strong><i>${icon}</i><p>${note}</p></article>`).join('');
  const lanes = [['review','Por revisar'],['attention','Por atender'],['production','En elaboración'],['delivery','Entrega y cierre']];
  $('#kanban').innerHTML = lanes.map(([key,label]) => { const laneOrders = visible.filter(order => laneFor(order.stage) === key); return `<section class="lane"><div class="lane-title"><i></i>${label}<span>${laneOrders.length}</span></div>${laneOrders.length ? laneOrders.map(orderCard).join('') : '<div class="empty-lane">Todo en orden por aquí.<br>Los pedidos aparecerán al avanzar.</div>'}</section>`; }).join('');
  $$('[data-order-ref]', $('#kanban')).forEach(button => button.addEventListener('click', () => openOrder(button.dataset.orderRef)));
}

function orderCard(order) {
  return `<button class="order-card" data-order-ref="${escapeHTML(order.ref)}"><div class="order-card-top"><span>${escapeHTML(order.ref)}</span><span>↗</span></div><h3>${escapeHTML(order.quantity)} × ${escapeHTML(order.product)}</h3><p>${escapeHTML(order.customer)} · ${escapeHTML(formatDate(order.date))}</p><div class="order-card-tags"><span class="order-tag ${order.depositVerified ? 'good' : ''}">${escapeHTML(stageLabels[order.stage])}</span>${order.designApproved ? '<span class="order-tag good">Diseño aprobado</span>' : ''}</div><div class="order-card-foot"><span>${PEN.format(order.total)}</span><b>${order.paid ? `Abono ${PEN.format(order.paid)}` : 'Sin verificar'}</b></div></button>`;
}

function openOrder(reference) {
  const order = orders.find(item => item.ref === reference); if (!order) return;
  const actions = [];
  if (order.stage === 'quote') actions.push({label:'Cotización revisada',next:'payment-review'});
  if (order.stage === 'payment-review') actions.push({label:'Verificar adelanto',next:'queued'});
  if (order.stage === 'queued') actions.push({label:'Crear diseño v1',next:'design'});
  if (order.stage === 'design' && !order.designApproved) actions.push({label:'Registrar aprobación',special:'approve'});
  if (order.stage === 'design' && order.designApproved) actions.push({label:'Iniciar producción',next:'production'});
  if (order.stage === 'production') actions.push({label:'Marcar como listo',next:'ready'});
  if (order.stage === 'ready' && order.paid < order.total) actions.push({label:'Verificar saldo',special:'balance'});
  if (order.stage === 'ready' && order.paid >= order.total) actions.push({label:'Confirmar entrega y cerrar',next:'delivered'});
  $('#order-detail').innerHTML = `<div class="detail-shell"><div class="detail-head"><div><span class="eyebrow">FICHA DEL PEDIDO</span><h2>${escapeHTML(order.ref)}</h2></div><button class="icon-button close-order" aria-label="Cerrar">×</button></div><span class="detail-status">${escapeHTML(stageLabels[order.stage])}</span><div class="detail-grid"><div class="detail-block"><small>Cliente</small><b>${escapeHTML(order.customer)}</b><p>${escapeHTML(order.phone)}</p></div><div class="detail-block"><small>Producto</small><b>${escapeHTML(order.quantity)} × ${escapeHTML(order.product)}</b><p>${escapeHTML(deliveryLabels[order.delivery])}</p></div><div class="detail-block full"><small>Personalización</small><p>${escapeHTML(order.specs)}</p>${order.referenceFile ? `<p>Referencia: ${escapeHTML(order.referenceFile)}</p>` : ''}</div><div class="detail-block"><small>Total referencial</small><b>${PEN.format(order.total)}</b><p>Pagos verificados: ${PEN.format(order.paid || 0)}</p></div><div class="detail-block"><small>Controles</small><b>${order.depositVerified ? 'Adelanto verificado' : 'Adelanto pendiente'}</b><p>${order.designApproved ? `Diseño v${order.designVersion} aprobado` : 'Diseño sin aprobación vigente'}</p></div></div><div class="detail-actions">${actions.map(action => `<button data-next="${action.next || ''}" data-special="${action.special || ''}">${escapeHTML(action.label)}</button>`).join('')}<button class="secondary" data-whatsapp-order>Contactar cliente</button></div>${order.deposit === null ? '<div class="detail-warning">El porcentaje de adelanto para esta cantidad debe definirse en la cotización.</div>' : ''}</div>`;
  $('.close-order').addEventListener('click', () => $('#order-dialog').close());
  $('[data-whatsapp-order]').addEventListener('click', () => sendWhatsApp(order.ref));
  $$('[data-next]', $('#order-detail')).forEach(button => button.addEventListener('click', () => advanceOrder(order.ref, button.dataset.next, button.dataset.special)));
  $('#order-dialog').showModal();
}

function advanceOrder(reference, next, special) {
  const order = orders.find(item => item.ref === reference); if (!order) return;
  if (special === 'approve') { order.designApproved = true; toast('Aprobación registrada para la versión vigente.'); }
  else if (special === 'balance') { order.paid = order.total; toast('Saldo registrado como verificado.'); }
  else {
    const draft = {...order};
    if (next === 'queued') { draft.depositVerified = true; draft.paid = draft.deposit ?? 0; }
    if (next === 'design') { draft.designVersion = Math.max(1,draft.designVersion || 0); draft.designApproved = false; }
    const check = canMoveStage(draft, next);
    if (!check.ok) { toast(check.reason); return; }
    Object.assign(order, draft, {stage:next});
    toast(`Pedido actualizado: ${stageLabels[next]}.`);
  }
  saveOrders(); renderAdmin(); openOrder(reference);
}

function openAdmin() {
  $('#admin-view').hidden = false; $('#admin-view').setAttribute('aria-hidden','false'); document.body.classList.add('locked'); renderAdmin(); history.replaceState(null,'','/gestion');
}
function closeAdmin() { $('#admin-view').hidden = true; $('#admin-view').setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); history.replaceState(null,'','/'); }

function setupAdmin() {
  $('#open-admin').addEventListener('click', openAdmin); $('#exit-admin').addEventListener('click', closeAdmin); $('#admin-search').addEventListener('input', renderAdmin);
  $('#view-newest').addEventListener('click', () => openOrder(orders[0]?.ref));
  if (location.pathname === '/gestion' || location.hash === '#gestion') openAdmin(); else renderAdmin();
}

function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('show'); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3300);
}

function setupGeneral() {
  $('#year').textContent = new Date().getFullYear();
  const menuButton = $('.menu-button');
  menuButton.addEventListener('click', () => { const open = $('#mobile-menu').hidden; $('#mobile-menu').hidden = !open; menuButton.setAttribute('aria-expanded',String(open)); });
  $$('.mobile-menu a, .mobile-menu button').forEach(item => item.addEventListener('click', () => { $('#mobile-menu').hidden = true; menuButton.setAttribute('aria-expanded','false'); }));
  $$('[data-whatsapp]').forEach(button => button.addEventListener('click', () => sendWhatsApp()));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12});
  $$('.reveal').forEach(element => observer.observe(element));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#chat-drawer').classList.contains('open')) closeChat(); });
}

async function initNeural() {
  try {
    neural = await loadNeuralIntent('./assets/intent-model.json');
    neuralMeta = neural.model;
    $('#neural-label').textContent = `${neuralMeta.training_examples} frases · 20 neuronas ocultas`;
    $('#model-meta').textContent = `${neuralMeta.architecture} · ${neuralMeta.training_examples} ejemplos de entrenamiento · La exactitud con clientes reales aún debe medirse.`;
  } catch {
    $('#neural-label').textContent = 'Clasificador de respaldo activo';
    $('#model-meta').textContent = 'El modelo principal no se cargó; se usa un clasificador local por palabras clave.';
  }
}

setupGeneral();
setupCatalog();
setupBuilder();
setupChat();
setupTracking();
setupAdmin();
initNeural();
