import AdminSidebar from "@/components/AdminSidebar";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATS, EMPLOYEURS, CANDIDATURES, SECTEURS, formatDate } from "@/lib/data";
import { Users, Briefcase, FileText, AlertCircle, Bell } from "lucide-react";

export default function AdminDashboard() {
  const pendingOffres = OFFRES.filter(o => o.statut === "en_attente");
  const recentUsers = [...CANDIDATS.map(c => ({ name: `${c.prenom} ${c.nom}`, role: "Candidat", date: c.date_inscription })),
    ...EMPLOYEURS.map(e => ({ name: e.entreprise, role: "Employeur", date: e.date_inscription }))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const sectorData = SECTEURS.map(s => ({
    name: s,
    count: OFFRES.filter(o => o.secteur === s).length,
  }));
  const maxCount = Math.max(...sectorData.map(s => s.count));

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
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">3</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">AD</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
          <StatCard label="Total utilisateurs" value={CANDIDATS.length + EMPLOYEURS.length} icon={<Users size={20} />} color="primary" />
          <StatCard label="Offres publiées" value={OFFRES.length} icon={<Briefcase size={20} />} color="success" />
          <StatCard label="Candidatures ce mois" value={CANDIDATURES.length} icon={<FileText size={20} />} color="muted" />
          <StatCard label="En attente modération" value={pendingOffres.length} icon={<AlertCircle size={20} />} color="destructive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart: Offres par secteur */}
          <div className="glass rounded-card p-6 fade-up stagger-2">
            <h2 className="font-heading font-semibold text-lg mb-6">Offres par secteur</h2>
            <div className="space-y-3">
              {sectorData.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 truncate">{s.name}</span>
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
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-btn hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(u.date)}</p>
                  </div>
                  <Badge text={u.role} variant={u.role === "Candidat" ? "primary" : "success"} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="glass rounded-card p-6 fade-up stagger-4">
          <h2 className="font-heading font-semibold text-lg mb-6">En attente de modération</h2>
          {pendingOffres.length > 0 ? (
            <div className="space-y-3">
              {pendingOffres.map(o => (
                <div key={o.id} className="flex items-center gap-4 p-4 rounded-btn border border-border hover:border-primary/20 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{o.titre}</h3>
                    <p className="text-xs text-muted-foreground">{o.entreprise} · {o.lieu} · {formatDate(o.date_publication)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-btn bg-success/10 text-success border border-success/20 text-sm hover:bg-success/20 transition-colors">Approuver</button>
                    <button className="px-4 py-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 text-sm hover:bg-destructive/20 transition-colors">Rejeter</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune offre en attente</p>
          )}
        </div>
      </main>
    </div>
  );
}
