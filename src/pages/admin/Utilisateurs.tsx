import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Badge from "@/components/Badge";
import { CANDIDATS, EMPLOYEURS, formatDate } from "@/lib/data";
import { Search, Eye, Ban, Trash2, Bell, X } from "lucide-react";

export default function AdminUtilisateurs() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<{ type: string; name: string } | null>(null);

  const allUsers = [
    ...CANDIDATS.map(c => ({
      id: `c${c.id}`, name: `${c.prenom} ${c.nom}`, email: c.email, role: "Candidat" as const,
      date: c.date_inscription, statut: c.statut, initials: `${c.prenom[0]}${c.nom[0]}`
    })),
    ...EMPLOYEURS.map(e => ({
      id: `e${e.id}`, name: e.entreprise, email: e.email, role: "Employeur" as const,
      date: e.date_inscription, statut: e.statut, initials: e.logo
    })),
  ];

  const filtered = allUsers.filter(u => {
    if (roleFilter !== "all" && u.role.toLowerCase() !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  const openModal = (type: string, name: string) => {
    setModalAction({ type, name });
    setShowModal(true);
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

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-up stagger-1">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 glass rounded-btn">
            <Search size={18} className="text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." className="bg-transparent text-sm w-full outline-none" />
          </div>
          <div className="flex gap-2">
            {["all", "candidat", "employeur"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors ${roleFilter === r ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>
                {r === "all" ? "Tous" : r === "candidat" ? "Candidats" : "Employeurs"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-card overflow-hidden fade-up stagger-2">
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
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">{u.initials}</div>
                        <span className="text-sm font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4"><Badge text={u.role} variant={u.role === "Candidat" ? "primary" : "success"} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(u.date)}</td>
                    <td className="px-6 py-4"><Badge text={u.statut === "actif" ? "Actif" : "Bloqué"} variant={u.statut === "actif" ? "success" : "destructive"} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                        <button onClick={() => openModal("bloquer", u.name)} className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive"><Ban size={14} /></button>
                        <button onClick={() => openModal("supprimer", u.name)} className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                Êtes-vous sûr de vouloir {modalAction.type} <span className="text-foreground font-medium">{modalAction.name}</span> ? Cette action est irréversible.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 glass rounded-btn text-sm">Annuler</button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-btn text-sm btn-press">Confirmer</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
