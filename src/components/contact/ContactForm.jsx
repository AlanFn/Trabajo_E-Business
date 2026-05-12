import { useState } from "react";
import Button from "../common/Button";
import FormField from "../common/FormField";
import Select from "../common/Select";
import { CheckIcon, ChevronDownIcon } from "../common/Icons";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="contact-form-wrapper">
      <h2 className="contact-form__heading">Envíanos un Mensaje</h2>
      <div className="contact-form__divider" />

      <div className="contact-form__row">
        <FormField id="firstName" label="Nombre" placeholder="María" />
        <FormField id="lastName" label="Apellido" placeholder="Pérez" />
      </div>

      <FormField
        id="clinicEmail"
        label="Correo Electrónico"
        placeholder="contacto@empresa.com"
        type="email"
      />

      <div className="contact-form__group">
        <label className="contact-form__label" htmlFor="subject">
          Asunto
        </label>
        <div className="contact-form__select-wrapper">
          <Select className="contact-form__select" id="subject">
            <option>Consulta General</option>
            <option>Pedido Personalizado</option>
            <option>Consulta sobre Productos</option>
            <option>Devoluciones y Cambios</option>
          </Select>
          <ChevronDownIcon className="contact-form__select-arrow" />
        </div>
      </div>

      <div className="contact-form__group">
        <label className="contact-form__label" htmlFor="message">
          Mensaje
        </label>
        <textarea
          className="contact-form__textarea"
          id="message"
          placeholder="¿Cómo podemos ayudarle?"
        />
      </div>

      <Button className="contact-form__submit" type="button" onClick={() => setSent(true)}>
        Enviar Consulta
      </Button>
      {sent && (
        <div className="contact-form__success">
          <CheckIcon />
          ¡Mensaje enviado! Nos pondremos en contacto en 24 horas.
        </div>
      )}
    </div>
  );
}
