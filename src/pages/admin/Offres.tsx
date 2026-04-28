import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/data";
import { adminApi, type ApiJob } from "@/lib/api";
import { Bell, Eye, CheckCircle, XCircle, Trash2, Loader2, AlertTriangle } from "lucide-react";

type Row = {
  id: number;
  titre: string;
  entreprise: string;
  secteur: string;
  date_publication: string;
  statut: "active" | "en_attente" | "rejetee" | "inactive";
  logo: string;
};

export default function AdminOffres() {
  const [filter, setFilter] = useState<string>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .jobs(filter)
      .then((res) => {
        const mapped: Row[] = (res.jobs as ApiJob[]).map((j) => ({
          id: j.id,
          titre: j.title,
          entreprise: j.entreprise,
          secteur: j.secteur,
          date_publication: j.created_at,
          statut: j.statut,
          logo: j.entreprise.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        }));
        setRows(mapped);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const moderate = async (id: number, statut: "active" | "rejetee") => {
    try {
      await adminApi.moderateJob(id, statut);
      toast({ title: statut === "active" ? "Offre approuvée" : "Offre rejetée" });
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Action locale (backend hors-ligne)", description: msg, variant: "destructive" });
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, statut } : r)));
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cette offre ?")) return;
    try {
      await adminApi.deleteJob(id);
      toast({ title: "Offre supprimée" });
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Erreur backend", description: msg, variant: "destructive" });
    }
  };

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
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Chargement des offres...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Aucune offre trouvée</div>
          ) : (
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
                {rows.map(o => (
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
                        <button onClick={() => moderate(o.id, "active")} title="Approuver" className="p-2 rounded-btn bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"><CheckCircle size={14} /></button>
                        <button onClick={() => moderate(o.id, "rejetee")} title="Rejeter" className="p-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"><XCircle size={14} /></button>
                        <button title="Voir" className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                        <button onClick={() => remove(o.id)} title="Supprimer" className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
