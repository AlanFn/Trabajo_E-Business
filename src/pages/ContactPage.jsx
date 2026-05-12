import ContactForm from "../components/contact/ContactForm";
import ContactInfoCard from "../components/contact/ContactInfoCard";
import { MailIcon, MapPinIcon, PhoneIcon } from "../components/common/Icons";

export default function ContactPage() {
  return (
    <main className="page page--contacto" id="page-contacto">
      <section className="contact-hero">
        <h1 className="contact-hero__title">Ponte en Contacto</h1>
        <p className="contact-hero__subtitle">
          Estamos aquí para ayudarle con pedidos personalizados, consultas sobre productos y
          cualquier otra consulta general. Póngase en contacto para recibir atención personalizada.
        </p>
      </section>

      <section className="contact-body">
        <ContactForm />

        <div className="contact-info">
          <div className="contact-info__cards">
            <ContactInfoCard
              icon={<PhoneIcon />}
              label="Soporte Directo"
              value="V-TECH - agregar número"
              hours="Lun-Vie, 9am - 6pm"
            />
            <ContactInfoCard
              icon={<MailIcon />}
              label="Envíenos un Correo"
              value="agregar email correcto"
              hours="Intentamos responder en 24hs"
            />
          </div>

          <div className="contact-showroom">
            <div className="contact-showroom__header">
              <div>
                <h3 className="contact-showroom__title">Sala de Exhibición</h3>
                <p className="contact-showroom__address">Agregar dirección - Paraguay</p>
              </div>
              <MapPinIcon />
            </div>
            <div className="contact-showroom__map">
              <img
                src="https://images.unsplash.com/photo-1576153192621-7a3be10b356e?w=700&q=80"
                alt="Mapa de ubicación"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
