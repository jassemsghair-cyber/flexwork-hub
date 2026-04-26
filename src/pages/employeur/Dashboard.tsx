import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { jobsApi, getCurrentUser } from "@/lib/api";
import { formatDate } from "@/lib/data";
import { Briefcase, Users, Clock, CheckCircle, Plus, Loader2, AlertTriangle } from "lucide-react";

interface DashboardData {
  stats: { offres_total: number; offres_actives: number; offres_en_attente: number; candidatures_total: number; candidatures_en_attente: number; };
  activity: { id: number; statut: string; created_at: string; candidat_nom: string; candidat_email: string; job_id: number; job_title: string; }[];
}

export default function EmployeurDashboard() {
  const user = getCurrentUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "employeur") {
      setError("Connectez-vous comme employeur.");
      setLoading(false);
      return;
    }
    jobsApi.employeurStats(user.id)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 fade-up">
            <div>
              <h1 className="font-heading font-bold text-3xl">
                Bonjour, {user?.entreprise || user?.name || "Employeur"} 👋
              </h1>
              <p className="text-muted-foreground mt-1">Voici un aperçu de votre activité</p>
            </div>
            <Link to="/employeur/ajouter-offre" className="hidden sm:flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90">
              <Plus size={18} /> Publier une offre
            </Link>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-btn bg-warning/10 border border-warning/30 text-warning text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
                <StatCard label="Offres actives"      value={data.stats.offres_actives}        icon={<Briefcase size={20} />} color="primary" />
                <StatCard label="En attente"          value={data.stats.offres_en_attente}     icon={<Clock size={20} />}     color="muted" />
                <StatCard label="Total candidatures"  value={data.stats.candidatures_total}    icon={<Users size={20} />}     color="success" />
                <StatCard label="À traiter"           value={data.stats.candidatures_en_attente} icon={<CheckCircle size={20} />} color="primary" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="glass rounded-card p-6 fade-up stagger-2">
                  <h2 className="font-heading font-semibold text-lg mb-6">Activité récente</h2>
                  <div className="space-y-4">
                    {data.activity.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">Aucune candidature pour le moment</p>
                    )}
                    {data.activity.map((act) => {
                      const initials = act.candidat_nom.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                      return (
                        <div key={act.id} className="flex items-center gap-3 p-3 rounded-btn hover:bg-muted/30 transition-colors">
                          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{act.candidat_nom}</span>
                              <span className="text-muted-foreground"> a postulé pour </span>
                              <span className="font-medium">{act.job_title}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(act.created_at)}</p>
                          </div>
                          <Badge
                            text={act.statut === "acceptee" ? "Acceptée" : act.statut === "refusee" ? "Refusée" : "En attente"}
                            variant={act.statut === "acceptee" ? "success" : act.statut === "refusee" ? "destructive" : "warning"}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
