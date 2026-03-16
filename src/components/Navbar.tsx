import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  userRole?: "candidat" | "employeur" | "admin" | null;
}

export default function Navbar({ userRole = null }: NavbarProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${isActive(path) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-strong shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">F</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">FlexWork</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass("/")}>Accueil</Link>
            <Link to="/offres" className={linkClass("/offres")}>Offres</Link>
            {userRole === "candidat" && (
              <>
                <Link to="/candidat/candidatures" className={linkClass("/candidat/candidatures")}>Mes candidatures</Link>
                <Link to="/candidat/profil" className={linkClass("/candidat/profil")}>Profil</Link>
              </>
            )}
            {userRole === "employeur" && (
              <>
                <Link to="/employeur/dashboard" className={linkClass("/employeur/dashboard")}>Dashboard</Link>
                <Link to="/employeur/mes-offres" className={linkClass("/employeur/mes-offres")}>Mes offres</Link>
              </>
            )}
            {userRole === "admin" && (
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>Admin</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!userRole ? (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-btn bg-primary text-primary-foreground text-sm font-medium btn-press hover:opacity-90 transition-opacity">
                  Poster une offre
                </Link>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {userRole === "candidat" ? "YB" : userRole === "employeur" ? "CM" : "AD"}
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-white/[0.06] animate-fade-up">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className={`block ${linkClass("/")}`} onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link to="/offres" className={`block ${linkClass("/offres")}`} onClick={() => setMobileOpen(false)}>Offres</Link>
            <Link to="/login" className={`block ${linkClass("/login")}`} onClick={() => setMobileOpen(false)}>Connexion</Link>
            <Link to="/register" className="block px-4 py-2 rounded-btn bg-primary text-primary-foreground text-sm font-medium text-center" onClick={() => setMobileOpen(false)}>
              Poster une offre
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
