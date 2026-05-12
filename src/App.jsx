import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import AdminProductsPage from "./pages/AdminProductsPage";
import CatalogPage from "./pages/CatalogPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage, { cerrarSesionAdmin, haySesionAdmin } from "./pages/LoginPage";

function App() {
  const [activePage, setActivePage] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [adminAuth, setAdminAuth] = useState(() => haySesionAdmin());

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (page) => {
    if (pathname !== "/") {
      window.history.pushState({}, "", "/");
      setPathname("/");
    }

    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToPublicSite = () => {
    window.history.pushState({}, "", "/");
    setPathname("/");
    setActivePage("inicio");
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
    <>
      <Header
        activePage={activePage}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((isOpen) => !isOpen)}
        onNavigate={navigateTo}
      />
      {activePage === "inicio" && <HomePage />}
      {activePage === "catalogo" && <CatalogPage />}
      {activePage === "contacto" && <ContactPage />}
      <Footer onNavigate={navigateTo} />
    </>
  );
}

export default App;
