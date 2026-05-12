import { pages } from "../../data/pages";

export default function Header({ activePage, menuOpen, onToggleMenu, onNavigate }) {
  return (
    <nav className="nav" id="navbar">
      <div className="nav__logo">V-TECH</div>
      <ul className={`nav__links${menuOpen ? " nav__links--open" : ""}`} id="navLinks">
        {pages.map((page) => (
          <li key={page.key}>
            <button
              className={`nav__link${activePage === page.key ? " nav__link--active" : ""}`}
              type="button"
              onClick={() => onNavigate(page.key)}
            >
              {page.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        className={`nav__hamburger${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Menú"
        aria-expanded={menuOpen}
        onClick={onToggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
