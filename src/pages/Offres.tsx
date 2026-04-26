import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { SECTEURS, VILLES, HORAIRES, Offre } from "@/lib/data";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ApiJob {
  id: number;
  title: string;
  entreprise?: string;
  secteur?: string;
  lieu?: string;
  salaire?: string;
  horaire?: string;
}

export default function Offres() {
  const [jobs, setJobs] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  const [selectedHoraire, setSelectedHoraire] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [salaireMin, setSalaireMin] = useState(0);
  const [salaireMax, setSalaireMax] = useState(2000);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("http://localhost/flexwork-backend/api.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Transformer les données API en format Offre
          const transformedJobs: Offre[] = data.jobs.map((job: ApiJob) => ({
            id: job.id,
            titre: job.title,
            entreprise: job.entreprise || "Entreprise inconnue",
            secteur: job.secteur || "Informatique",
            horaire: job.horaire || "Temps plein",
            lieu: job.lieu || "Tunis",
            salaire: parseFloat(job.salaire || "1500"),
            logo: "D",
            statut: "active" as const,
            type: "CDI",
            description: "Description à venir",
            competences: ["Compétences requises"],
            date_publication: new Date().toISOString(),
          }));
          setJobs(transformedJobs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = jobs;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter((o) => o.titre.toLowerCase().includes(s));
    }
    // Ajoute d'autres filtres si nécessaire

    return result;
  }, [jobs, search]);

  if (loading) return <div>Chargement...</div>;

  const toggleSecteur = (s: string) => {
    setSelectedSecteurs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedSecteurs([]);
    setSelectedHoraire("");
    setSelectedVille("");
    setSalaireMin(0);
    setSalaireMax(2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 fade-up">
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl">
                Offres d'emploi
              </h1>
              <p className="text-muted-foreground mt-2">
                {filtered.length} offre{filtered.length > 1 ? "s" : ""} trouvée
                {filtered.length > 1 ? "s" : ""}
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
            <aside
              className={`w-[280px] flex-shrink-0 ${showFilters ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden md:block"}`}
            >
              {showFilters && (
                <button
                  onClick={() => setShowFilters(false)}
                  className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <X size={16} /> Fermer
                </button>
              )}
              <div className="glass rounded-card p-5 space-y-6 sticky top-24">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rechercher
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-btn">
                    <Search size={16} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Poste, entreprise..."
                      className="bg-transparent text-sm w-full outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Secteur
                  </label>
                  <div className="space-y-2">
                    {SECTEURS.map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSecteurs.includes(s)}
                          onChange={() => toggleSecteur(s)}
                          className="w-4 h-4 rounded border-border bg-muted accent-primary"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Salaire: {salaireMin} - {salaireMax} DT
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={salaireMax}
                    onChange={(e) => setSalaireMax(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Horaire
                  </label>
                  <div className="space-y-2">
                    {HORAIRES.map((h) => (
                      <label
                        key={h}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="horaire"
                          checked={selectedHoraire === h}
                          onChange={() => setSelectedHoraire(h)}
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
                    value={selectedVille}
                    onChange={(e) => setSelectedVille(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 rounded-btn text-sm outline-none"
                  >
                    <option value="">Toutes les villes</option>
                    {VILLES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 glass rounded-btn text-sm outline-none"
                >
                  <option value="recent">Plus récent</option>
                  <option value="salaire_asc">Salaire ↑</option>
                  <option value="salaire_desc">Salaire ↓</option>
                </select>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtered.map((offre, i) => (
                    <JobCard
                      key={offre.id}
                      offre={offre}
                      className={`fade-up stagger-${(i % 6) + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass rounded-card">
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Aucune offre trouvée
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Essayez de modifier vos filtres de recherche
                  </p>
                </div>
              )}

              {/* Pagination visual */}
              {filtered.length > 0 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      className={`w-10 h-10 rounded-btn text-sm font-medium transition-colors ${
                        p === 1
                          ? "bg-primary text-primary-foreground"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
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
