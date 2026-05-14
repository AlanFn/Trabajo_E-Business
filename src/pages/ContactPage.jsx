import ContactForm from "../components/contact/ContactForm";
import ContactInfoCard from "../components/contact/ContactInfoCard";
import {
  InstagramIcon,
  MailIcon,
  ThreadsIcon,
  WhatsAppIcon,
} from "../components/common/Icons";
import { whatsappGeneralLink, whatsappPhoneDisplay } from "../utils/whatsapp";

const contactEmail = "Ventas@vtech.com.py";
const instagramUrl = "https://www.instagram.com/vtech.py";
const instagramHandle = "@vtech.py";
const threadsUrl =
  "https://www.threads.com/@vtech.py?xmt=AQG0Gz-CM1hpifMXP6IId44Y4YOuOg9zpAF6itOgteifDrA";

const directContactItems = [
  {
    key: "email",
    icon: <MailIcon />,
    label: "Correo electrónico",
    value: contactEmail,
    description: "Canal para presupuestos, consultas institucionales y seguimiento.",
    action: "Enviar email",
    href: `mailto:${contactEmail}`,
  },
  {
    key: "whatsapp-direct",
    icon: <WhatsAppIcon />,
    label: "WhatsApp",
    value: whatsappPhoneDisplay,
    description: "Canal principal para asesoramiento, consultas rápidas y pedidos.",
    action: "Escribir por WhatsApp",
    href: whatsappGeneralLink(),
    external: true,
    badge: "Principal",
  },
];

const socialItems = [
  {
    key: "instagram",
    icon: <InstagramIcon />,
    label: "Instagram",
    value: instagramHandle,
    description: "Novedades, trabajos realizados y consultas por mensaje directo.",
    action: "Ver perfil",
    href: instagramUrl,
    external: true,
  },
  {
    key: "threads",
    icon: <ThreadsIcon />,
    label: "Threads",
    value: "@vtech.py",
    description: "Actualizaciones de la marca y novedades del trabajo diario.",
    action: "Ver perfil",
    href: threadsUrl,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <main className="page page--contacto" id="page-contacto">
      <section className="contact-hero">
        <h1 className="contact-hero__title">Contacto</h1>
        <p className="contact-hero__subtitle">
          Contactá con V-TECH por nuestros canales digitales. Coordinamos asesoramiento, consultas,
          pedidos y entregas sin local presencial.
        </p>
      </section>

      <section className="contact-body">
        <div className="contact-panel">
          <section
            className="contact-section contact-section--direct"
            aria-labelledby="contact-info-title"
          >
            <div className="contact-section__header">
              <p className="contact-section__eyebrow">Datos directos</p>
              <h2 className="contact-section__title" id="contact-info-title">
                Información de contacto
              </h2>
              <p className="contact-section__intro">
                Atención digital para consultas, asesoramiento y coordinación de entregas.
              </p>
            </div>

            <div className="contact-info__cards contact-info__cards--direct">
              {directContactItems.map((item) => (
                <ContactInfoCard {...item} key={item.key} />
              ))}
            </div>
          </section>

          <section
            className="contact-section contact-section--social"
            aria-labelledby="contact-social-title"
          >
            <div className="contact-section__header">
              <p className="contact-section__eyebrow">Canales digitales</p>
              <h2 className="contact-section__title" id="contact-social-title">
                Redes sociales
              </h2>
              <p className="contact-section__intro">
                Seguinos o escribinos por los perfiles oficiales disponibles.
              </p>
            </div>

            <div className="contact-info__cards contact-info__cards--social">
              {socialItems.map((item) => (
                <ContactInfoCard {...item} key={item.key} />
              ))}
            </div>
          </section>
        </div>

        <section className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="contact-form-section__intro">
            <p className="contact-section__eyebrow">Consulta personalizada</p>
            <h2 className="contact-section__title" id="contact-form-title">
              Contanos qué necesitás
            </h2>
            <p className="contact-section__intro">
              Completá el formulario y te orientamos con prendas, talles, accesorios o pedidos para
              tu equipo de trabajo.
            </p>
          </div>
          <ContactForm />
        </section>
      </section>
    </main>
  );
}
