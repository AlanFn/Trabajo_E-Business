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

export function whatsappCartLink(items, resumen = {}) {
  const lineas = [
    "¡Hola! Quiero consultar por estos productos:",
    "",
    ...items.flatMap((item, index) => {
      const detalles = [
        `${index + 1}. ${item.nombre}`,
        item.color ? `Color: ${item.color}` : null,
        item.talle ? `Talle: ${item.talle}` : null,
        `Cantidad: ${item.cantidad}`,
        item.precioTexto ? `Precio unitario: ${item.precioTexto}` : "Precio unitario: Precio a consultar",
        item.subtotalTexto ? `Subtotal: ${item.subtotalTexto}` : null,
      ].filter(Boolean);

      return [...detalles, ""];
    }),
  ];

  if (resumen.totalTexto) {
    lineas.push(`Total estimado: ${resumen.totalTexto}`);
  } else if (resumen.totalParcialTexto) {
    lineas.push(`Total parcial: ${resumen.totalParcialTexto}`);
    lineas.push("Hay productos con precio a consultar.");
  } else {
    lineas.push("Precios a consultar.");
  }

  lineas.push("");
  lineas.push("¿Me podrían confirmar disponibilidad y detalles?");

  return `https://api.whatsapp.com/send/?phone=${whatsappPhoneNumber}&text=${encodeURIComponent(lineas.join("\n"))}&type=phone_number&app_absent=0&utm_source=cart`;
}
