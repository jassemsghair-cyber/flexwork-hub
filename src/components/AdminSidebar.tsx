import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
    { path: "/admin/offres", label: "Offres", icon: Briefcase },
  ];

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 glass-strong border-r border-white/[0.06] flex flex-col z-40">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">F</span>
          </div>
          <span className="font-heading font-bold text-lg">FlexWork</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Panneau d'administration</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all ${
              isActive(path)
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground">admin@flexwork.tn</p>
          </div>
          <LogOut size={16} className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors" />
        </div>
      </div>
    </aside>
  );
}
