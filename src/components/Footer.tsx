import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">F</span>
              </div>
              <span className="font-heading font-bold text-lg">FlexWork</span>
            </div>
            <p className="text-sm text-muted-foreground">La plateforme n°1 pour les emplois à temps partiel en Tunisie.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Plateforme</h4>
            <div className="space-y-2">
              <Link to="/offres" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Offres d'emploi</Link>
              <Link to="/register" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Inscription</Link>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Employeurs</h4>
            <div className="space-y-2">
              <Link to="/employeur/ajouter-offre" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Publier une offre</Link>
              <Link to="/employeur/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>contact@flexwork.tn</p>
              <p>+216 71 000 000</p>
              <p>Tunis, Tunisie</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2025 FlexWork. Tous droits réservés.</p>
          <div className="flex gap-4">
            {["Facebook", "LinkedIn", "Instagram"].map(s => (
              <span key={s} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
