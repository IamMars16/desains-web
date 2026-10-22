# Artis Jesús · web con Venus

Sitio web responsive para presentar el catálogo, preparar pedidos personalizados, consultar su avance y demostrar el panel interno de gestión. Venus usa una red neuronal MLP pequeña para clasificar intenciones; las cotizaciones, adelantos y estados se calculan con reglas de negocio independientes.

## Probar localmente

```bash
npm test
npm run check
npm start
```

Abre `http://localhost:4173`. El código de seguimiento de demostración es `AJ-2401`.

## Configuración comercial

Edita `dist/assets/config.js` antes de usar el sitio con clientes reales:

- número de WhatsApp con código de país y sin `+`;
- precios confirmados;
- capacidad, plazo mínimo y medios de pago;
- fotografías reales del catálogo si se desea reemplazar las ilustraciones.

La web no confirma depósitos bancarios por una captura. El encargado debe comprobar el ingreso y luego marcar el adelanto como verificado. La integración por QR con WhatsApp normal pertenece al prototipo local separado y no se ejecuta en Vercel.

## Publicación

El sitio es estático. En Vercel, configura `dist` como Output Directory y deja los comandos de instalación y compilación vacíos.
