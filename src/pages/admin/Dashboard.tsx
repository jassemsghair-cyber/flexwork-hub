import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATS, EMPLOYEURS, CANDIDATURES, SECTEURS, formatDate } from "@/lib/data";
import { adminApi, type ApiAdminStats } from "@/lib/api";
import { Users, Briefcase, FileText, AlertCircle, Bell, Loader2, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<ApiAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .stats()
      .then((res) => {
        setStats(res.stats);
        setUsingFallback(false);
      })
      .catch(() => {
        const sectorData = SECTEURS.map((s) => ({
          secteur: s,
          count: OFFRES.filter((o) => o.secteur === s).length,
        }));
        const recent = [
          ...CANDIDATS.map((c) => ({ id: c.id, name: `${c.prenom} ${c.nom}`, email: c.email, role: "candidat", created_at: c.date_inscription })),
          ...EMPLOYEURS.map((e) => ({ id: e.id, name: e.entreprise, email: e.email, role: "employeur", created_at: e.date_inscription })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
        const pending = OFFRES.filter((o) => o.statut === "en_attente").map((o) => ({
          id: o.id, title: o.titre, entreprise: o.entreprise, lieu: o.lieu, created_at: o.date_publication,
        }));
        setStats({
          total_users: CANDIDATS.length + EMPLOYEURS.length,
          total_candidats: CANDIDATS.length,
          total_employeurs: EMPLOYEURS.length,
          total_admins: 1,
          total_jobs: OFFRES.length,
          jobs_active: OFFRES.filter((o) => o.statut === "active").length,
          jobs_en_attente: pending.length,
          jobs_rejetee: OFFRES.filter((o) => o.statut === "rejetee").length,
          total_candidatures: CANDIDATURES.length,
          candidatures_en_attente: CANDIDATURES.filter((c) => c.statut === "en_attente").length,
          candidatures_acceptee: CANDIDATURES.filter((c) => c.statut === "acceptee").length,
          candidatures_refusee: CANDIDATURES.filter((c) => c.statut === "refusee").length,
          par_secteur: sectorData,
          inscriptions_recentes: recent,
          offres_en_attente: pending,
        });
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const moderate = async (id: number, statut: "active" | "rejetee") => {
    try {
      await adminApi.moderateJob(id, statut);
      toast({ title: statut === "active" ? "Offre approuvée" : "Offre rejetée" });
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Erreur backend", description: msg, variant: "destructive" });
    }
  };

  const maxCount = stats ? Math.max(1, ...stats.par_secteur.map((s) => s.count)) : 1;

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-[280px] p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="font-heading font-bold text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de la plateforme</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 glass rounded-btn text-muted-foreground hover:text-foreground">
              <Bell size={20} />
              {stats && stats.jobs_en_attente > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                  {stats.jobs_en_attente}
                </span>
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">AD</div>
          </div>
        </div>

        {usingFallback && (
          <div className="mb-4 flex items-center gap-2 text-xs text-warning fade-up">
            <AlertTriangle size={14} /> Backend PHP indisponible — données de démonstration.
          </div>
        )}

        {loading || !stats ? (
          <div className="text-center py-20 glass rounded-card">
            <Loader2 size={32} className="mx-auto text-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Chargement du tableau de bord...</p>
          </div>
        ) : (
        <>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
          <StatCard label="Total utilisateurs" value={stats.total_users} icon={<Users size={20} />} color="primary" />
          <StatCard label="Offres publiées" value={stats.total_jobs} icon={<Briefcase size={20} />} color="success" />
          <StatCard label="Candidatures" value={stats.total_candidatures} icon={<FileText size={20} />} color="muted" />
          <StatCard label="En attente modération" value={stats.jobs_en_attente} icon={<AlertCircle size={20} />} color="destructive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart: Offres par secteur */}
          <div className="glass rounded-card p-6 fade-up stagger-2">
            <h2 className="font-heading font-semibold text-lg mb-6">Offres par secteur</h2>
            <div className="space-y-3">
              {stats.par_secteur.map((s) => (
                <div key={s.secteur} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 truncate">{s.secteur}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                      style={{ width: `${(s.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="glass rounded-card p-6 fade-up stagger-3">
            <h2 className="font-heading font-semibold text-lg mb-6">Inscriptions récentes</h2>
            <div className="space-y-3">
              {stats.inscriptions_recentes.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-btn hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                  </div>
                  <Badge
                    text={u.role === "candidat" ? "Candidat" : u.role === "employeur" ? "Employeur" : "Admin"}
                    variant={u.role === "candidat" ? "primary" : u.role === "employeur" ? "success" : "warning"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="glass rounded-card p-6 fade-up stagger-4">
          <h2 className="font-heading font-semibold text-lg mb-6">En attente de modération</h2>
          {stats.offres_en_attente.length > 0 ? (
            <div className="space-y-3">
              {stats.offres_en_attente.map((o) => (
                <div key={o.id} className="flex items-center gap-4 p-4 rounded-btn border border-border hover:border-primary/20 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{o.title}</h3>
                    <p className="text-xs text-muted-foreground">{o.entreprise} · {o.lieu} · {formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => moderate(o.id, "active")} className="px-4 py-2 rounded-btn bg-success/10 text-success border border-success/20 text-sm hover:bg-success/20 transition-colors">Approuver</button>
                    <button onClick={() => moderate(o.id, "rejetee")} className="px-4 py-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 text-sm hover:bg-destructive/20 transition-colors">Rejeter</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune offre en attente</p>
          )}
        </div>
        </>
        )}
      </main>
    </div>
  );
}
