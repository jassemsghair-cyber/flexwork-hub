import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { jobsApi, getCurrentUser, ApiEmployeurJob } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { formatSalaire } from "@/lib/data";

export default function MesOffres() {
  const [offres, setOffres] = useState<ApiEmployeurJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const load = () => {
    const user = getCurrentUser();
    if (!user || user.role !== "employeur") {
      setError("Connectez-vous comme employeur pour voir vos offres.");
      setLoading(false);
      return;
    }
    setLoading(true);
    jobsApi.byEmployeur(user.id)
      .then((data) => { setOffres(data.jobs); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette offre ? Toutes les candidatures associées seront supprimées.")) return;
    setDeletingId(id);
    try {
      await jobsApi.remove(id);
      setOffres((prev) => prev.filter((o) => o.id !== id));
      toast({ title: "Offre supprimée" });
    } catch (e) {
      toast({ title: "Erreur", description: e instanceof Error ? e.message : "Impossible", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 fade-up">
            <h1 className="font-heading font-bold text-3xl">Mes offres</h1>
            <Link to="/employeur/ajouter-offre" className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90">
              <Plus size={18} /> Nouvelle offre
            </Link>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-btn bg-warning/10 border border-warning/30 text-warning text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
          ) : offres.length === 0 ? (
            <div className="text-center py-20 glass rounded-card">
              <p className="text-4xl mb-4">📋</p>
              <h3 className="font-heading font-semibold text-lg mb-2">Aucune offre publiée</h3>
              <p className="text-sm text-muted-foreground mb-4">Commencez par publier votre première offre.</p>
              <Link to="/employeur/ajouter-offre" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-btn text-sm">
                <Plus size={16} /> Publier
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {offres.map((offre, i) => (
                <div key={offre.id} className={`glass rounded-card p-6 card-hover fade-up stagger-${(i % 6) + 1}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-btn bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-primary text-sm">{offre.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold">{offre.title}</h3>
                      <p className="text-sm text-muted-foreground">{offre.lieu} · {formatSalaire(parseFloat(offre.salaire))}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link to={`/employeur/candidatures?job=${offre.id}`} className="text-sm text-muted-foreground hover:text-primary">
                        {offre.nb_candidatures} candidature{offre.nb_candidatures > 1 ? "s" : ""}
                      </Link>
                      <Badge
                        text={offre.statut === "active" ? "Active" : offre.statut === "en_attente" ? "En attente" : offre.statut === "rejetee" ? "Rejetée" : "Inactive"}
                        variant={offre.statut === "active" ? "success" : offre.statut === "en_attente" ? "warning" : "destructive"}
                      />
                      <button
                        onClick={() => handleDelete(offre.id)}
                        disabled={deletingId === offre.id}
                        className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {deletingId === offre.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
