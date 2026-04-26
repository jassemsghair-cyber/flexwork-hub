import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { SECTEURS, VILLES, HORAIRES, OFFRES, Offre } from "@/lib/data";
import { jobsApi, ApiJob } from "@/lib/api";
import { Search, SlidersHorizontal, X, AlertTriangle } from "lucide-react";

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

export default function Offres() {
  const [jobs, setJobs] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiDown, setApiDown] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  const [selectedHoraire, setSelectedHoraire] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [salaireMax, setSalaireMax] = useState(2000);
  const [sortBy, setSortBy] = useState<"recent" | "salaire_asc" | "salaire_desc">("recent");
  const [showFilters, setShowFilters] = useState(false);

  // Charger depuis l'API avec les filtres serveur
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    jobsApi
      .list({
        search: search || undefined,
        secteur: selectedSecteurs.length === 1 ? selectedSecteurs[0] : undefined,
        lieu: selectedVille || undefined,
        horaire: selectedHoraire || undefined,
        salaire_max: salaireMax < 2000 ? salaireMax : undefined,
        sort: sortBy,
        statut: "active",
      })
      .then((data) => {
        if (cancelled) return;
        setJobs(data.jobs.map(apiToOffre));
        setApiDown(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback offline : mocks
        setJobs(OFFRES.filter((o) => o.statut === "active"));
        setApiDown(true);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [search, selectedSecteurs, selectedVille, selectedHoraire, salaireMax, sortBy]);

  // Filtre côté client pour les multi-secteurs (le backend gère un seul secteur à la fois)
  const filtered = useMemo(() => {
    if (selectedSecteurs.length <= 1) return jobs;
    return jobs.filter((o) => selectedSecteurs.includes(o.secteur));
  }, [jobs, selectedSecteurs]);

  const toggleSecteur = (s: string) => {
    setSelectedSecteurs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const resetFilters = () => {
    setSearch(""); setSelectedSecteurs([]); setSelectedHoraire("");
    setSelectedVille(""); setSalaireMax(2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {apiDown && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-btn bg-warning/10 border border-warning/30 text-warning text-sm fade-up">
              <AlertTriangle size={16} />
              Backend PHP indisponible — affichage des données de démonstration.
            </div>
          )}

          <div className="flex items-center justify-between mb-8 fade-up">
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl">Offres d'emploi</h1>
              <p className="text-muted-foreground mt-2">
                {loading ? "Chargement..." : `${filtered.length} offre${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 glass rounded-btn text-sm"
            >
              <SlidersHorizontal size={16} /> Filtres
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`w-[280px] flex-shrink-0 ${showFilters ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden md:block"}`}>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <X size={16} /> Fermer
                </button>
              )}
              <div className="glass rounded-card p-5 space-y-6 sticky top-24">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rechercher</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-btn">
                    <Search size={16} className="text-muted-foreground" />
                    <input
                      type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Poste, entreprise..."
                      className="bg-transparent text-sm w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Secteur</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {SECTEURS.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                        <input
                          type="checkbox" checked={selectedSecteurs.includes(s)}
                          onChange={() => toggleSecteur(s)}
                          className="w-4 h-4 rounded border-border bg-muted accent-primary"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salaire max: {salaireMax} DT</label>
                  <input
                    type="range" min={300} max={2000} step={50} value={salaireMax}
                    onChange={(e) => setSalaireMax(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Horaire</label>
                  <div className="space-y-2">
                    {HORAIRES.map((h) => (
                      <label key={h} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                        <input
                          type="radio" name="horaire" checked={selectedHoraire === h}
                          onChange={() => setSelectedHoraire(h === selectedHoraire ? "" : h)}
                          className="accent-primary"
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Lieu</label>
                  <select
                    value={selectedVille} onChange={(e) => setSelectedVille(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 rounded-btn text-sm outline-none"
                  >
                    <option value="">Toutes les villes</option>
                    {VILLES.map((v) => (<option key={v} value={v}>{v}</option>))}
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-btn transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </aside>

            {/* Job Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-end mb-6">
                <select
                  value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 glass rounded-btn text-sm outline-none"
                >
                  <option value="recent">Plus récent</option>
                  <option value="salaire_asc">Salaire ↑</option>
                  <option value="salaire_desc">Salaire ↓</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass rounded-card p-6 h-48 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtered.map((offre, i) => (
                    <JobCard key={offre.id} offre={offre} className={`fade-up stagger-${(i % 6) + 1}`} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass rounded-card">
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="font-heading font-semibold text-lg mb-2">Aucune offre trouvée</h3>
                  <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
