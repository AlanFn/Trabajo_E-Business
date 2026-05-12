export function whatsappLink(productName, opciones = {}) {
  const detalles = [
    opciones.color ? `Color: ${opciones.color}` : null,
    opciones.talle ? `Talle: ${opciones.talle}` : null,
  ].filter(Boolean);
  const detalleTexto = detalles.length ? `\n${detalles.join("\n")}` : "";
  const text = `¡Hola! Estoy interesado/a en el *${productName}*.${detalleTexto} ¿Me podrí­an dar más información?`;

  return `https://api.whatsapp.com/send/?phone=595987366671&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0&utm_source=ig`;
}
