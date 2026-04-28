import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/data";
import { candidaturesApi, jobsApi, usersApi, type ApiCandidatureForJob, type ApiEmployeurJob, type AuthUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, User, Loader2, AlertTriangle, Phone, Mail, MapPin, Calendar, X } from "lucide-react";

type Row = {
  id: number;
  candidat_nom: string;
  candidat_email: string;
  candidat_ville: string;
  initials: string;
  date_postulation: string;
  statut: "en_attente" | "acceptee" | "refusee";
  candidat_id: number;
};

export default function EmployeurCandidatures() {
  const { user } = useAuth();
  const location = useLocation();
  const [mesOffres, setMesOffres] = useState<ApiEmployeurJob[]>([]);
  const [selectedOffre, setSelectedOffre] = useState(0);

  // Parse job and status from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobId = params.get("job");
    const statut = params.get("statut");
    if (jobId) setSelectedOffre(Number(jobId));
    if (statut) setStatusFilter(statut);
  }, [location.search]);
  const [selectedCandidat, setSelectedCandidat] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      jobsApi.byEmployeur(user.id)
        .then(res => {
          setMesOffres(res.jobs);
          if (res.jobs.length > 0 && selectedOffre === 0) {
            // Only auto-select first job if none selected via URL
            setSelectedOffre(res.jobs[0].id);
          }
        })
        .catch(console.error);
    }
  }, [user?.id]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
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
          candidat_id: c.candidat_id,
        }));
        setRows(mapped);
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedOffre) load(selectedOffre, statusFilter);
  }, [selectedOffre, statusFilter]);

  const updateStatus = async (id: number, newStatut: "acceptee" | "refusee") => {
    try {
      if (newStatut === "refusee") {
        await candidaturesApi.remove(id);
        toast({ title: "Candidature supprimée", description: "La candidature a été refusée et supprimée." });
      } else {
        await candidaturesApi.updateStatus(id, newStatut);
        toast({ title: "Mis à jour", description: `Candidature ${newStatut === "acceptee" ? "acceptée" : "refusée"}.` });
      }
      load(selectedOffre, statusFilter);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading font-bold text-3xl mb-2 fade-up">Candidatures reçues</h1>

          {/* Offer Selector */}
          <div className="mb-6 fade-up stagger-1">
            <label className="text-sm font-medium mb-2 block">Sélectionner une offre</label>
            <select
              value={selectedOffre}
              onChange={e => setSelectedOffre(Number(e.target.value))}
              className="px-4 py-3 glass rounded-btn text-sm outline-none w-full max-w-md"
            >
              {mesOffres.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6 fade-up stagger-2">
            {[
              { key: "all", label: "Toutes" },
              { key: "en_attente", label: "En attente" },
              { key: "acceptee", label: "Acceptées" },
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
                      <button 
                        onClick={() => setSelectedCandidat(c.candidat_id)}
                        className="p-2 glass rounded-btn text-muted-foreground hover:text-primary transition-colors" 
                        title="Voir le profil"
                      >
                        <User size={16} />
                      </button>
                      <button 
                        onClick={() => updateStatus(c.id, "acceptee")} 
                        className="p-2 rounded-btn bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors" 
                        title="Accepter"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => updateStatus(c.id, "refusee")} 
                        className="p-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors" 
                        title="Refuser"
                      >
                        <XCircle size={16} />
                      </button>
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

      {/* Candidate Profile Modal */}
      {selectedCandidat && (
        <CandidateProfileModal 
          id={selectedCandidat} 
          onClose={() => setSelectedCandidat(null)} 
        />
      )}

      <Footer />
    </div>
  );
}

function CandidateProfileModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.getProfile(id)
      .then(res => setUser(res.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-strong rounded-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border-primary/20 scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 glass rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 size={40} className="mx-auto text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        ) : user ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-3xl">
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-heading font-bold text-3xl mb-1">{user.name}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail size={14} /> {user.email}
                  </div>
                  {user.telephone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone size={14} /> {user.telephone}
                    </div>
                  )}
                  {user.ville && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={14} /> {user.ville}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <CheckCircle size={18} className="text-primary" /> Compétences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.competences && user.competences.length > 0 ? (
                    user.competences.map(c => (
                      <span key={c} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                        {c}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Disponibilités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.disponibilites && user.disponibilites.length > 0 ? (
                    user.disponibilites.map(d => (
                      <span key={d} className="px-3 py-1.5 glass rounded-btn text-sm">
                        {d}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune disponibilité renseignée</p>
                  )}
                </div>
              </div>
            </div>

            {user.cv && (
              <div className="pt-4 border-t border-border">
                <button className="w-full py-3 glass rounded-btn font-medium flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                   Consulter le CV (PDF)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-destructive">
            <AlertTriangle size={40} className="mx-auto mb-4" />
            <p>Impossible de charger le profil du candidat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
