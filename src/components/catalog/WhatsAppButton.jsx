import { whatsappLink } from "../../utils/whatsapp";
import { WhatsAppIcon } from "../common/Icons";

export default function WhatsAppButton({ product, selectedColor, selectedTalle }) {
  return (
    <a
      className="product-card__add"
      href={whatsappLink(product.nombre, {
        color: selectedColor,
        talle: selectedTalle,
      })}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
      Consultar
    </a>
  );
}
