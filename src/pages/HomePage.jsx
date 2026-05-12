import heroImage from "../../image_hd.png";
import FeatureCard from "../components/home/FeatureCard";
import InstagramCarousel from "../components/home/InstagramCarousel";
import { BodyIcon, LabIcon, ShieldIcon, ZoomIcon } from "../components/common/Icons";

export default function HomePage() {
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
        <div className="inicio-hero__image">
          <img src={heroImage} alt="Profesional con indumentaria V-TECH" />
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
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80"
            alt="Primer plano de tela premium"
          />
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
