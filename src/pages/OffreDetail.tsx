import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import Badge from "@/components/Badge";
import { OFFRES, formatSalaire, formatDate, Offre } from "@/lib/data";
import { candidaturesApi, jobsApi, ApiJob } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Clock, Calendar, Share2, Briefcase, Loader2 } from "lucide-react";

function apiToOffre(j: ApiJob): Offre {
  return {
    id: j.id,
    titre: j.title,
    entreprise: j.entreprise || "—",
    logo: j.logo || (j.entreprise ? j.entreprise.slice(0, 2).toUpperCase() : "??"),
    lieu: j.lieu || "—",
    secteur: j.secteur || "—",
    salaire: parseFloat(j.salaire || "0"),
    horaire: j.horaire || "—",
    type: j.type || "Temps partiel",
    description: j.description || "",
    competences: j.competences || [],
    date_publication: j.created_at,
    statut: (j.statut === "active" || j.statut === "en_attente" || j.statut === "rejetee") ? j.statut : "active",
  };
}

export default function OffreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [similar, setSimilar] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const jobId = Number(id);
    if (!jobId) return;
    setLoading(true);
    jobsApi.get(jobId)
      .then((data) => {
        const o = apiToOffre(data.job);
        setOffre(o);
        return jobsApi.list({ secteur: o.secteur, statut: "active" }).then((res) => {
          setSimilar(res.jobs.filter((j) => j.id !== o.id).slice(0, 3).map(apiToOffre));
        }).catch(() => {});
      })
      .catch(() => {
        // Fallback mocks
        const fallback = OFFRES.find((o) => o.id === jobId) || null;
        setOffre(fallback);
        if (fallback) {
          setSimilar(OFFRES.filter((o) => o.secteur === fallback.secteur && o.id !== fallback.id).slice(0, 3));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!offre) return;
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter pour postuler.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (user.role !== "candidat") {
      toast({ title: "Action impossible", description: "Seuls les candidats peuvent postuler.", variant: "destructive" });
      return;
    }
    setApplying(true);
    try {
      await candidaturesApi.apply({ job_id: offre.id, candidat_id: user.id, message: message || undefined });
      setApplied(true);
      toast({ title: "Candidature envoyée", description: `Votre candidature pour "${offre.titre}" a été enregistrée.` });
    } catch (err) {
      toast({ title: "Impossible de postuler", description: err instanceof Error ? err.message : "Erreur", variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl mb-4">Offre non trouvée</h1>
          <Link to="/offres" className="text-primary text-sm">← Retour aux offres</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/offres" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 fade-up">
            <ArrowLeft size={16} /> Retour aux offres
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 fade-up stagger-1">
              <div className="glass rounded-card p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-card bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="font-heading font-bold text-primary text-xl">{offre.logo}</span>
                  </div>
                  <div>
                    <h1 className="font-heading font-bold text-2xl md:text-3xl">{offre.titre}</h1>
                    <p className="text-muted-foreground mt-1">{offre.entreprise}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <Badge text={offre.secteur} variant="primary" />
                  <Badge text={offre.horaire} />
                  <Badge text={offre.type} />
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="font-heading font-semibold text-lg mb-3">Description du poste</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{offre.description}</p>

                  {offre.competences.length > 0 && (
                    <>
                      <h3 className="font-heading font-semibold text-lg mt-8 mb-3">Compétences requises</h3>
                      <div className="flex flex-wrap gap-2">
                        {offre.competences.map((c) => (
                          <span key={c} className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground">{c}</span>
                        ))}
                      </div>
                    </>
                  )}

                  <h3 className="font-heading font-semibold text-lg mt-8 mb-3">À propos de {offre.entreprise}</h3>
                  <p className="text-muted-foreground">
                    {offre.entreprise} est une entreprise basée à {offre.lieu}, active dans le secteur {offre.secteur.toLowerCase()}.
                    Nous offrons un environnement de travail dynamique et des opportunités de croissance.
                  </p>
                </div>
              </div>

              {/* Similar Jobs */}
              {similar.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-heading font-semibold text-xl mb-6">Offres similaires</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {similar.map((o) => <JobCard key={o.id} offre={o} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-[350px] fade-up stagger-2">
              <div className="glass rounded-card p-6 sticky top-24 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Salaire</p>
                  <p className="font-heading font-bold text-3xl text-success">{formatSalaire(offre.salaire)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-muted-foreground" /><span>{offre.lieu}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Clock size={16} className="text-muted-foreground" /><span>{offre.horaire}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Briefcase size={16} className="text-muted-foreground" /><span>{offre.type}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-muted-foreground" /><span>Publié le {formatDate(offre.date_publication)}</span></div>
                </div>

                {!applied && (
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message de motivation (optionnel)"
                    rows={3}
                    className="w-full px-3 py-2 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                )}

                <button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {applying && <Loader2 size={16} className="animate-spin" />}
                  {applied ? "Candidature envoyée ✓" : applying ? "Envoi..." : "Postuler maintenant"}
                </button>

                <div className="flex justify-center gap-4 pt-2">
                  <button className="text-muted-foreground hover:text-foreground transition-colors"><Share2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
