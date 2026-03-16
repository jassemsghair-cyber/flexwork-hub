import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATURES, CANDIDATS, formatDate } from "@/lib/data";
import { Briefcase, Users, Eye, TrendingUp, Plus } from "lucide-react";

export default function EmployeurDashboard() {
  const employeurOffres = OFFRES.filter(o => o.entreprise === "Café Médina");
  const offreCandidatures = CANDIDATURES.filter(c => employeurOffres.some(o => o.id === c.offre_id));

  const recentActivity = offreCandidatures
    .sort((a, b) => new Date(b.date_postulation).getTime() - new Date(a.date_postulation).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-8 fade-up">
            <div>
              <h1 className="font-heading font-bold text-3xl">Bonjour, Café Médina 👋</h1>
              <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité</p>
            </div>
            <Link to="/employeur/ajouter-offre" className="hidden sm:flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90">
              <Plus size={18} /> Publier une offre
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
            <StatCard label="Offres actives" value={employeurOffres.filter(o => o.statut === "active").length} icon={<Briefcase size={20} />} color="primary" />
            <StatCard label="Total candidatures" value={offreCandidatures.length} icon={<Users size={20} />} color="success" />
            <StatCard label="Vues cette semaine" value={234} icon={<Eye size={20} />} color="muted" />
            <StatCard label="Taux de réponse" value="87%" icon={<TrendingUp size={20} />} color="primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="glass rounded-card p-6 fade-up stagger-2">
              <h2 className="font-heading font-semibold text-lg mb-6">Activité récente</h2>
              <div className="space-y-4">
                {recentActivity.map(act => {
                  const candidat = CANDIDATS.find(c => c.id === act.candidat_id);
                  const offre = OFFRES.find(o => o.id === act.offre_id);
                  if (!candidat || !offre) return null;
                  return (
                    <div key={act.id} className="flex items-center gap-3 p-3 rounded-btn hover:bg-muted/30 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                        {candidat.prenom[0]}{candidat.nom[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{candidat.prenom} {candidat.nom}</span>
                          <span className="text-muted-foreground"> a postulé pour </span>
                          <span className="font-medium">{offre.titre}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(act.date_postulation)}</p>
                      </div>
                      <Badge
                        text={act.statut === "acceptee" ? "Acceptée" : act.statut === "refusee" ? "Refusée" : "En attente"}
                        variant={act.statut === "acceptee" ? "success" : act.statut === "refusee" ? "destructive" : "warning"}
                      />
                    </div>
                  );
                })}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente</p>
                )}
              </div>
            </div>

            {/* Active Offers */}
            <div className="glass rounded-card p-6 fade-up stagger-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-lg">Mes offres actives</h2>
                <Link to="/employeur/mes-offres" className="text-sm text-primary hover:opacity-80">Voir tout</Link>
              </div>
              <div className="space-y-4">
                {employeurOffres.slice(0, 3).map(offre => {
                  const count = CANDIDATURES.filter(c => c.offre_id === offre.id).length;
                  return (
                    <div key={offre.id} className="p-4 rounded-btn border border-border hover:border-primary/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{offre.titre}</h3>
                        <Badge text={offre.statut === "active" ? "Active" : "En attente"} variant={offre.statut === "active" ? "success" : "warning"} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{count} candidature{count > 1 ? "s" : ""}</span>
                        <span>Publié le {formatDate(offre.date_publication)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
