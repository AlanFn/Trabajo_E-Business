import { useState } from "react";
import FeatureCard from "../components/home/FeatureCard";
import InstagramCarousel from "../components/home/InstagramCarousel";
import { BodyIcon, LabIcon, ShieldIcon, ZoomIcon } from "../components/common/Icons";

const vtechImages = {
  hero: "/images/inicio/hero.png",
  about: "/images/inicio/nosotros.jpeg",
  fabric: "/images/inicio/sectores.jpeg",
};

const institutionalCards = [
  {
    title: "Misión",
    text: "Diseñar y desarrollar prendas, atuendos y accesorios de trabajo que ofrezcan protección, comodidad y durabilidad, permitiendo que el profesional desempeñe sus tareas con seguridad, libertad de movimiento y una imagen moderna y profesional.",
  },
  {
    title: "Visión",
    text: "Convertir a V-TECH en una marca referente a nivel regional e internacional en indumentaria técnica para profesionales, reconocida por su innovación, calidad, funcionalidad y estilo en entornos de trabajo exigentes.",
  },
];

const values = [
  {
    title: "Compromiso",
    text: "Ofrecer productos confiables que acompañen al profesional en cada jornada.",
  },
  {
    title: "Calidad",
    text: "Desarrollar prendas resistentes, cómodas y duraderas.",
  },
  {
    title: "Innovación",
    text: "Mejorar continuamente diseños y tecnologías según las necesidades reales del trabajo.",
  },
  {
    title: "Responsabilidad",
    text: "Actuar con seriedad y respeto hacia clientes, colaboradores y aliados.",
  },
  {
    title: "Honestidad",
    text: "Construir relaciones transparentes y de confianza.",
  },
  {
    title: "Funcionalidad",
    text: "Crear prendas prácticas y eficientes para el día a día.",
  },
  {
    title: "Estilo profesional",
    text: "Transmitir presencia, identidad y elegancia mediante la indumentaria laboral.",
  },
];

export default function HomePage() {
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [aboutImageFailed, setAboutImageFailed] = useState(false);
  const [fabricImageFailed, setFabricImageFailed] = useState(false);

  return (
    <main className="page page--inicio" id="page-inicio">
      <section className="inicio-hero">
        <div className="inicio-hero__content">
          <span className="inicio-hero__tag">Fabricado en Paraguay</span>
          <h1 className="inicio-hero__title">
            Protección y Comodidad
            <br />
            para Cada Jornada.
          </h1>
          <p className="inicio-hero__text">
            En V-TECH fabricamos indumentaria de trabajo impermeable, segura, ligera y funcional.
            Diseñada para brindar libertad de movimiento y protección real en los entornos más
            exigentes.
          </p>
        </div>
        <figure className="inicio-hero__image">
          {heroImageFailed ? (
            <div className="image-fallback">Imagen V-TECH</div>
          ) : (
            <img
              src={vtechImages.hero}
              alt="Indumentaria V-TECH fabricada en Paraguay"
              decoding="async"
              onError={() => setHeroImageFailed(true)}
            />
          )}
        </figure>
      </section>

      <section className="inicio-about" id="nosotros">
        <div className="inicio-about__inner">
          <div className="inicio-about__header">
            <span className="inicio-about__eyebrow">Identidad V-TECH</span>
            <h2 className="inicio-about__title">Nosotros</h2>
            <p className="inicio-about__text">
              Creamos indumentaria laboral paraguaya para profesionales que necesitan protección
              real, comodidad diaria y una imagen moderna en entornos exigentes.
            </p>
          </div>

          <div className="inicio-about__feature">
            <div className="inicio-about__copy">
              <p>
                Diseñamos prendas y accesorios pensados para acompañar jornadas intensas, con
                materiales resistentes, funcionalidad práctica y una presencia profesional cuidada.
              </p>
            </div>
            <div className="inicio-about__visual">
              {aboutImageFailed ? (
                <div className="image-fallback">Imagen V-TECH</div>
              ) : (
                <img
                  src={vtechImages.about}
                  alt="Equipo de V-TECH usando indumentaria de trabajo"
                  loading="lazy"
                  decoding="async"
                  onError={() => setAboutImageFailed(true)}
                />
              )}
            </div>
          </div>

          <div className="inicio-about__cards">
            {institutionalCards.map((card) => (
              <article className="inicio-about__card" key={card.title}>
                <h3 className="inicio-about__card-title">{card.title}</h3>
                <p className="inicio-about__card-text">{card.text}</p>
              </article>
            ))}
          </div>

          <div className="inicio-values">
            <h3 className="inicio-values__title">Valores</h3>
            <div className="inicio-values__grid">
              {values.map((value) => (
                <article className="inicio-values__card" key={value.title}>
                  <h4 className="inicio-values__card-title">{value.title}</h4>
                  <p className="inicio-values__card-text">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="inicio-commitment">
        <h2 className="inicio-commitment__title">Nuestro Compromiso con la Calidad</h2>
        <p className="inicio-commitment__subtitle">
          Cada prenda está confeccionada con materiales de alta calidad, resistentes y duraderos.
          Todos nuestros productos son fabricados en Paraguay con posibilidad de personalización.
        </p>
        <div className="inicio-commitment__cards">
          <FeatureCard
            icon={<LabIcon />}
            title="Materiales Resistentes"
            text="Confeccionados con materiales de alta calidad que protegen contra suciedad, aceites y líquidos. Impermeables, fáciles de lavar y secar durante largas jornadas de trabajo."
          />
          <FeatureCard
            icon={<BodyIcon />}
            title="Diseño Ergonómico"
            text="Diseño ergonómico que permite moverse con libertad, agilidad y sin restricciones. Modelos innovadores que fusionan dos telas para una sensación más fresca durante el trabajo."
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="Personalización Total"
            text="Posibilidad de personalizar la indumentaria según el pedido del cliente. Todos nuestros productos son fabricados en Paraguay con los más altos estándares de calidad."
          />
        </div>
      </section>

      <section className="inicio-fabric">
        <div className="inicio-fabric__image">
          {fabricImageFailed ? (
            <div className="image-fallback">Imagen no disponible</div>
          ) : (
            <img
              src={vtechImages.fabric}
              alt="Prendas V-TECH para distintos sectores laborales"
              loading="lazy"
              decoding="async"
              onError={() => setFabricImageFailed(true)}
            />
          )}
          <button className="inicio-fabric__zoom" type="button" aria-label="Ampliar imagen">
            <ZoomIcon />
          </button>
        </div>
        <div className="inicio-fabric__content">
          <h2 className="inicio-fabric__title">Versatilidad para Cada Sector Laboral</h2>
          <p className="inicio-fabric__text">
            Nuestra indumentaria no es simplemente ropa de trabajo. Es una herramienta diseñada para
            proteger y rendir en los entornos más exigentes. Ideal para veterinaria, frigoríficos,
            fumigación, lavaderos, talleres y pintura. Prendas impermeables, prácticas y fáciles de
            transportar que proyectan una imagen profesional positiva ante colegas y clientes.
          </p>
          <div className="inicio-fabric__tags">
            <span className="inicio-fabric__tag">Impermeable</span>
            <span className="inicio-fabric__tag">Ergonómico</span>
            <span className="inicio-fabric__tag">Personalizable</span>
          </div>
        </div>
      </section>

      <InstagramCarousel />
    </main>
  );
}
