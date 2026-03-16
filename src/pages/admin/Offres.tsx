import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Badge from "@/components/Badge";
import { OFFRES, formatDate } from "@/lib/data";
import { Bell, Eye, CheckCircle, XCircle } from "lucide-react";

export default function AdminOffres() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? OFFRES :
    OFFRES.filter(o => o.statut === filter);

  const tabs = [
    { key: "all", label: "Toutes" },
    { key: "active", label: "Actives" },
    { key: "en_attente", label: "En attente" },
    { key: "rejetee", label: "Rejetées" },
  ];

  const statusBadge = (statut: string) => {
    switch (statut) {
      case "active": return <Badge text="Active" variant="success" />;
      case "en_attente": return <Badge text="En attente" variant="warning" />;
      case "rejetee": return <Badge text="Rejetée" variant="destructive" />;
      default: return <Badge text={statut} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-[280px] p-8">
        <div className="flex items-center justify-between mb-8 fade-up">
          <h1 className="font-heading font-bold text-2xl">Gestion des offres</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 glass rounded-btn text-muted-foreground hover:text-foreground">
              <Bell size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">AD</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 fade-up stagger-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors ${filter === t.key ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass rounded-card overflow-hidden fade-up stagger-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Titre</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Entreprise</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Secteur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Statut</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-btn bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">{o.logo}</div>
                        <span className="text-sm font-medium">{o.titre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.entreprise}</td>
                    <td className="px-6 py-4"><Badge text={o.secteur} variant="primary" /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(o.date_publication)}</td>
                    <td className="px-6 py-4">{statusBadge(o.statut)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-btn bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"><CheckCircle size={14} /></button>
                        <button className="p-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"><XCircle size={14} /></button>
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
