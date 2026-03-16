import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { CANDIDATURES, OFFRES, formatDate } from "@/lib/data";
import { FileText, Clock, CheckCircle, XCircle, Briefcase } from "lucide-react";

export default function CandidatCandidatures() {
  const [filter, setFilter] = useState<string>("all");

  // Using candidat_id = 1 (Yasmine)
  const myCandidatures = CANDIDATURES.filter(c => c.candidat_id === 1);

  const filtered = useMemo(() => {
    if (filter === "all") return myCandidatures;
    return myCandidatures.filter(c => c.statut === filter);
  }, [filter]);

  const stats = {
    total: myCandidatures.length,
    en_attente: myCandidatures.filter(c => c.statut === "en_attente").length,
    acceptee: myCandidatures.filter(c => c.statut === "acceptee").length,
    refusee: myCandidatures.filter(c => c.statut === "refusee").length,
  };

  const statusBadge = (statut: string) => {
    switch (statut) {
      case "acceptee": return <Badge text="Acceptée" variant="success" />;
      case "refusee": return <Badge text="Refusée" variant="destructive" />;
      default: return <Badge text="En attente" variant="warning" />;
    }
  };

  const tabs = [
    { key: "all", label: "Toutes" },
    { key: "en_attente", label: "En attente" },
    { key: "acceptee", label: "Acceptées" },
    { key: "refusee", label: "Refusées" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar userRole="candidat" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading font-bold text-3xl mb-8 fade-up">Mes candidatures</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
            <StatCard label="Total" value={stats.total} icon={<FileText size={20} />} color="primary" />
            <StatCard label="En attente" value={stats.en_attente} icon={<Clock size={20} />} color="muted" />
            <StatCard label="Acceptées" value={stats.acceptee} icon={<CheckCircle size={20} />} color="success" />
            <StatCard label="Refusées" value={stats.refusee} icon={<XCircle size={20} />} color="destructive" />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto fade-up stagger-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-2 rounded-btn text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === t.key ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Application Cards */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((candidature, i) => {
                const offre = OFFRES.find(o => o.id === candidature.offre_id);
                if (!offre) return null;
                return (
                  <div key={candidature.id} className={`glass rounded-card p-5 card-hover fade-up stagger-${(i % 6) + 1}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-btn bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-bold text-primary text-sm">{offre.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold">{offre.titre}</h3>
                        <p className="text-sm text-muted-foreground">{offre.entreprise} · {offre.lieu}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Postulé le</p>
                          <p className="text-sm">{formatDate(candidature.date_postulation)}</p>
                        </div>
                        {statusBadge(candidature.statut)}
                        <Link to={`/offre/${offre.id}`} className="text-sm text-primary hover:opacity-80">
                          Voir l'offre
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-card">
              <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">Aucune candidature</h3>
              <p className="text-sm text-muted-foreground mb-4">Vous n'avez pas encore de candidatures dans cette catégorie</p>
              <Link to="/offres" className="text-primary text-sm hover:opacity-80">Parcourir les offres →</Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
