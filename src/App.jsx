import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CartDrawer from "./components/cart/CartDrawer";
import { CartProvider } from "./context/CartContext";
import AdminProductsPage from "./pages/AdminProductsPage";
import CatalogPage from "./pages/CatalogPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage, { cerrarSesionAdmin, haySesionAdmin } from "./pages/LoginPage";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));
  const [adminAuth, setAdminAuth] = useState(() => haySesionAdmin());

  useEffect(() => {
    const syncRoute = () =>
      setRoute({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });

    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  useEffect(() => {
    if (route.pathname === "/" && route.hash === "#nosotros") {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToSection("nosotros"));
      });
    }
  }, [route.pathname, route.hash]);

  const pathname = route.pathname;
  const activePage =
    pathname === "/catalogo" ? "catalogo" : pathname === "/contacto" ? "contacto" : "inicio";
  const activeNav = pathname === "/" && route.hash === "#nosotros" ? "nosotros" : activePage;

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const navHeight = document.getElementById("navbar")?.offsetHeight || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const navigateTo = (page) => {
    if (page === "nosotros") {
      window.history.pushState({}, "", "/#nosotros");
      setRoute({ pathname: "/", hash: "#nosotros" });
      setMenuOpen(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToSection("nosotros"));
      });
      return;
    }

    const rutas = {
      inicio: "/",
      catalogo: "/catalogo",
      contacto: "/contacto",
    };
    const nextPath = rutas[page] || "/";

    window.history.pushState({}, "", nextPath);
    setRoute({ pathname: nextPath, hash: "" });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToPublicSite = () => {
    window.history.pushState({}, "", "/");
    setRoute({ pathname: "/", hash: "" });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoutAdmin = () => {
    cerrarSesionAdmin();
    setAdminAuth(false);
  };

  if (pathname === "/admin") {
    return adminAuth ? (
      <AdminProductsPage onLogout={logoutAdmin} onBack={navigateToPublicSite} />
    ) : (
      <LoginPage onLogin={() => setAdminAuth(true)} onBack={navigateToPublicSite} />
    );
  }

  return (
    <CartProvider>
      <Header
        activePage={activeNav}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((isOpen) => !isOpen)}
        onNavigate={navigateTo}
      />
      {activePage === "inicio" && <HomePage />}
      {activePage === "catalogo" && <CatalogPage />}
      {activePage === "contacto" && <ContactPage />}
      <CartDrawer />
      <Footer onNavigate={navigateTo} />
    </CartProvider>
  );
}

export default App;
