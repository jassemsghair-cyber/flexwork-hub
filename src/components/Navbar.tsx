import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, LayoutDashboard, Briefcase, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  userRole?: "candidat" | "employeur" | "admin" | null;
}

export default function Navbar({ userRole: propUserRole = null }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // prioritize prop role if provided (for backward compatibility/demo), otherwise use auth context
  const role = propUserRole || user?.role || null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${isActive(path) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
            {role === "candidat" && (
              <>
                <Link to="/candidat/candidatures" className={linkClass("/candidat/candidatures")}>Mes candidatures</Link>
                <Link to="/candidat/profil" className={linkClass("/candidat/profil")}>Profil</Link>
              </>
            )}
            {role === "employeur" && (
              <>
                <Link to="/employeur/dashboard" className={linkClass("/employeur/dashboard")}>Dashboard</Link>
                <Link to="/employeur/candidatures" className={linkClass("/employeur/candidatures")}>Candidatures</Link>
              </>
            )}
            {role === "admin" && (
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>Admin</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-btn bg-primary text-primary-foreground text-sm font-medium btn-press hover:opacity-90 transition-opacity">
                  Poster une offre
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/30 transition-colors">
                    {getInitials(user.name)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-white/[0.06]">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === "candidat" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/candidat/profil")}>
                        <User className="mr-2 h-4 w-4" /> Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/candidat/candidatures")}>
                        <FileText className="mr-2 h-4 w-4" /> Mes candidatures
                      </DropdownMenuItem>
                    </>
                  )}
                  {role === "employeur" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/employeur/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/employeur/candidatures")}>
                        <FileText className="mr-2 h-4 w-4" /> Candidatures reçues
                      </DropdownMenuItem>
                    </>
                  )}
                  {role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            
            {!user ? (
              <>
                <Link to="/login" className={`block ${linkClass("/login")}`} onClick={() => setMobileOpen(false)}>Connexion</Link>
                <Link to="/register" className="block px-4 py-2 rounded-btn bg-primary text-primary-foreground text-sm font-medium text-center" onClick={() => setMobileOpen(false)}>
                  Poster une offre
                </Link>
              </>
            ) : (
              <>
                <div className="h-px bg-white/[0.06] my-2" />
                {role === "candidat" && (
                  <>
                    <Link to="/candidat/profil" className={`block ${linkClass("/candidat/profil")}`} onClick={() => setMobileOpen(false)}>Profil</Link>
                    <Link to="/candidat/candidatures" className={`block ${linkClass("/candidat/candidatures")}`} onClick={() => setMobileOpen(false)}>Mes candidatures</Link>
                  </>
                )}
                {role === "employeur" && (
                  <>
                    <Link to="/employeur/dashboard" className={`block ${linkClass("/employeur/dashboard")}`} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <Link to="/employeur/candidatures" className={`block ${linkClass("/employeur/candidatures")}`} onClick={() => setMobileOpen(false)}>Candidatures</Link>
                  </>
                )}
                {role === "admin" && (
                  <Link to="/admin/dashboard" className={`block ${linkClass("/admin/dashboard")}`} onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setMobileOpen(false); }} 
                  className="block w-full text-left py-2 text-sm font-medium text-destructive transition-colors"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

