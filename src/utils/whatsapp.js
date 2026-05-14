export const whatsappPhoneNumber = "595987366671";
export const whatsappPhoneDisplay = "+595 987 366 671";

export function whatsappGeneralLink() {
  const text =
    "¡Hola! Quiero recibir asesoramiento de V-TECH para encontrar una prenda o accesorio de trabajo.";

  return `https://api.whatsapp.com/send/?phone=${whatsappPhoneNumber}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0&utm_source=site`;
}

export function whatsappLink(productName, opciones = {}) {
  const detalles = [
    opciones.color ? `Color: ${opciones.color}` : null,
    opciones.talle ? `Talle: ${opciones.talle}` : null,
  ].filter(Boolean);
  const detalleTexto = detalles.length ? `\n${detalles.join("\n")}` : "";
  const text = `¡Hola! Estoy interesado/a en el *${productName}*.${detalleTexto} ¿Me podrían dar más información?`;

  return `https://api.whatsapp.com/send/?phone=${whatsappPhoneNumber}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0&utm_source=ig`;
}
