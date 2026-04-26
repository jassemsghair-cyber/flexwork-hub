import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATURES, CANDIDATS, formatDate } from "@/lib/data";
import { candidaturesApi, type ApiCandidatureForJob } from "@/lib/api";
import { CheckCircle, XCircle, User, Loader2, AlertTriangle } from "lucide-react";

type Row = {
  id: number;
  candidat_nom: string;
  candidat_email: string;
  candidat_ville: string;
  initials: string;
  date_postulation: string;
  statut: "en_attente" | "acceptee" | "refusee";
};

export default function EmployeurCandidatures() {
  const mesOffres = OFFRES.filter(o => ["Café Médina", "Brew House Café"].includes(o.entreprise));
  const [selectedOffre, setSelectedOffre] = useState(mesOffres[0]?.id || 0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const { toast } = useToast();

  const load = (jobId: number, statut: string) => {
    setLoading(true);
    candidaturesApi
      .listByJob(jobId, statut)
      .then((res) => {
        const mapped: Row[] = (res.candidatures as ApiCandidatureForJob[]).map((c) => ({
          id: c.id,
          candidat_nom: c.candidat_nom,
          candidat_email: c.candidat_email,
          candidat_ville: c.candidat_ville ?? "",
          initials: c.candidat_nom.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
          date_postulation: c.date_postulation,
          statut: c.statut,
        }));
        setRows(mapped);
        setUsingFallback(false);
      })
      .catch(() => {
        const fallback = CANDIDATURES
          .filter((c) => c.offre_id === jobId && (statut === "all" || c.statut === statut))
          .map((c) => {
            const cand = CANDIDATS.find((x) => x.id === c.candidat_id)!;
            return {
              id: c.id,
              candidat_nom: `${cand.prenom} ${cand.nom}`,
              candidat_email: cand.email,
              candidat_ville: cand.ville,
              initials: `${cand.prenom[0]}${cand.nom[0]}`,
              date_postulation: c.date_postulation,
              statut: c.statut,
            } as Row;
          });
        setRows(fallback);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedOffre) load(selectedOffre, statusFilter);
  }, [selectedOffre, statusFilter]);

  const updateStatus = async (id: number, newStatut: "acceptee" | "refusee") => {
    try {
      await candidaturesApi.updateStatus(id, newStatut);
      toast({ title: "Mis à jour", description: `Candidature ${newStatut === "acceptee" ? "acceptée" : "refusée"}.` });
      load(selectedOffre, statusFilter);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Action locale (backend hors-ligne)", description: msg, variant: "destructive" });
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, statut: newStatut } : r)));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading font-bold text-3xl mb-2 fade-up">Candidatures reçues</h1>
          {usingFallback && (
            <div className="mb-6 flex items-center gap-2 text-xs text-warning fade-up">
              <AlertTriangle size={14} /> Backend PHP indisponible — données de démonstration.
            </div>
          )}

          {/* Offer Selector */}
          <div className="mb-6 fade-up stagger-1">
            <label className="text-sm font-medium mb-2 block">Sélectionner une offre</label>
            <select
              value={selectedOffre}
              onChange={e => setSelectedOffre(Number(e.target.value))}
              className="px-4 py-3 glass rounded-btn text-sm outline-none w-full max-w-md"
            >
              {mesOffres.map(o => (
                <option key={o.id} value={o.id}>{o.titre}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6 fade-up stagger-2">
            {[
              { key: "all", label: "Toutes" },
              { key: "en_attente", label: "En attente" },
              { key: "acceptee", label: "Acceptées" },
              { key: "refusee", label: "Refusées" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors ${
                  statusFilter === t.key ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-4">{rows.length} candidature{rows.length > 1 ? "s" : ""}</p>

          {loading ? (
            <div className="text-center py-20 glass rounded-card">
              <Loader2 size={32} className="mx-auto text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          ) : rows.length > 0 ? (
            <div className="space-y-4">
              {rows.map((c, i) => (
                <div key={c.id} className={`glass rounded-card p-5 card-hover fade-up stagger-${(i % 6) + 1}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-primary text-sm">{c.initials}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{c.candidat_nom}</h3>
                      <p className="text-sm text-muted-foreground">{c.candidat_email}{c.candidat_ville ? ` · ${c.candidat_ville}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{formatDate(c.date_postulation)}</span>
                      <Badge
                        text={c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}
                        variant={c.statut === "acceptee" ? "success" : c.statut === "refusee" ? "destructive" : "warning"}
                      />
                      <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground"><User size={16} /></button>
                      <button onClick={() => updateStatus(c.id, "acceptee")} className="p-2 rounded-btn bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"><CheckCircle size={16} /></button>
                      <button onClick={() => updateStatus(c.id, "refusee")} className="p-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"><XCircle size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-card">
              <User size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">Aucune candidature</h3>
              <p className="text-sm text-muted-foreground">Pas encore de candidatures pour cette offre</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
