import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import Badge from "@/components/Badge";
import { CANDIDATS, EMPLOYEURS, formatDate } from "@/lib/data";
import { adminApi, type ApiUser } from "@/lib/api";
import { Search, Eye, Ban, Trash2, Bell, X, Loader2, AlertTriangle, Check } from "lucide-react";

type Row = {
  id: number;
  name: string;
  email: string;
  role: "candidat" | "employeur" | "admin";
  date: string;
  statut: "actif" | "bloque";
  initials: string;
};

export default function AdminUtilisateurs() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<{ type: "bloquer" | "debloquer" | "supprimer"; user: Row } | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .users({ role: roleFilter, search })
      .then((res) => {
        const mapped: Row[] = (res.users as ApiUser[]).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          date: u.created_at,
          statut: u.statut,
          initials: u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
        }));
        setRows(mapped);
        setUsingFallback(false);
      })
      .catch(() => {
        const mock: Row[] = [
          ...CANDIDATS.map((c, i) => ({
            id: 10000 + i, name: `${c.prenom} ${c.nom}`, email: c.email,
            role: "candidat" as const, date: c.date_inscription, statut: c.statut,
            initials: `${c.prenom[0]}${c.nom[0]}`,
          })),
          ...EMPLOYEURS.map((e, i) => ({
            id: 20000 + i, name: e.entreprise, email: e.email,
            role: "employeur" as const, date: e.date_inscription, statut: e.statut,
            initials: e.logo,
          })),
        ].filter((u) => {
          if (roleFilter !== "all" && u.role !== roleFilter) return false;
          if (search) {
            const s = search.toLowerCase();
            return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
          }
          return true;
        });
        setRows(mock);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, search]);

  const openModal = (type: "bloquer" | "debloquer" | "supprimer", user: Row) => {
    setModalAction({ type, user });
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!modalAction) return;
    const { type, user } = modalAction;
    try {
      if (type === "supprimer") {
        await adminApi.deleteUser(user.id);
        toast({ title: "Utilisateur supprimé", description: user.name });
      } else {
        const newStatut = type === "bloquer" ? "bloque" : "actif";
        await adminApi.setUserStatus(user.id, newStatut);
        toast({ title: type === "bloquer" ? "Utilisateur bloqué" : "Utilisateur débloqué", description: user.name });
      }
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Erreur backend", description: msg, variant: "destructive" });
    } finally {
      setShowModal(false);
      setModalAction(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-[280px] p-8">
        <div className="flex items-center justify-between mb-8 fade-up">
          <h1 className="font-heading font-bold text-2xl">Utilisateurs</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 glass rounded-btn text-muted-foreground hover:text-foreground">
              <Bell size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">AD</div>
          </div>
        </div>

        {usingFallback && (
          <div className="mb-4 flex items-center gap-2 text-xs text-warning fade-up">
            <AlertTriangle size={14} /> Backend PHP indisponible — données de démonstration.
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-up stagger-1">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 glass rounded-btn">
            <Search size={18} className="text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." className="bg-transparent text-sm w-full outline-none" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "candidat", "employeur", "admin"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors ${roleFilter === r ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>
                {r === "all" ? "Tous" : r === "candidat" ? "Candidats" : r === "employeur" ? "Employeurs" : "Admins"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-card overflow-hidden fade-up stagger-2">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Chargement des utilisateurs...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Rôle</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Inscription</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Statut</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(u => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">{u.initials}</div>
                        <span className="text-sm font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <Badge
                        text={u.role === "candidat" ? "Candidat" : u.role === "employeur" ? "Employeur" : "Admin"}
                        variant={u.role === "candidat" ? "primary" : u.role === "employeur" ? "success" : "warning"}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(u.date)}</td>
                    <td className="px-6 py-4"><Badge text={u.statut === "actif" ? "Actif" : "Bloqué"} variant={u.statut === "actif" ? "success" : "destructive"} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground" title="Voir"><Eye size={14} /></button>
                        {u.statut === "actif" ? (
                          <button onClick={() => openModal("bloquer", u)} className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive" title="Bloquer"><Ban size={14} /></button>
                        ) : (
                          <button onClick={() => openModal("debloquer", u)} className="p-2 glass rounded-btn text-muted-foreground hover:text-success" title="Débloquer"><Check size={14} /></button>
                        )}
                        <button onClick={() => openModal("supprimer", u)} className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive" title="Supprimer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* Confirm Modal */}
        {showModal && modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <div className="glass-strong rounded-card p-8 max-w-md w-full mx-4 animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg">Confirmer l'action</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Êtes-vous sûr de vouloir <span className="text-foreground font-medium">{modalAction.type}</span>{" "}
                <span className="text-foreground font-medium">{modalAction.user.name}</span> ?
                {modalAction.type === "supprimer" && " Cette action est irréversible."}
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 glass rounded-btn text-sm">Annuler</button>
                <button onClick={confirmAction} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-btn text-sm btn-press">Confirmer</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
