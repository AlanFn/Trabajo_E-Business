export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">V-TECH</span>
        <p className="footer__copy">© 2026 V-TECH. Indumentaria de Trabajo - Fabricado en Paraguay.</p>
      </div>
      <nav className="footer__links" aria-label="Navegación del pie de página">
        <button className="footer__link" type="button" onClick={() => onNavigate("contacto")}>
          Contactar Soporte
        </button>
      </nav>
    </footer>
  );
}
