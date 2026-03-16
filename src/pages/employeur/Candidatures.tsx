import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATURES, CANDIDATS, formatDate } from "@/lib/data";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function EmployeurCandidatures() {
  const mesOffres = OFFRES.filter(o => ["Café Médina", "Brew House Café"].includes(o.entreprise));
  const [selectedOffre, setSelectedOffre] = useState(mesOffres[0]?.id || 0);
  const [statusFilter, setStatusFilter] = useState("all");

  const candidatures = CANDIDATURES.filter(c => c.offre_id === selectedOffre);
  const filtered = statusFilter === "all" ? candidatures : candidatures.filter(c => c.statut === statusFilter);

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading font-bold text-3xl mb-8 fade-up">Candidatures reçues</h1>

          {/* Offer Selector */}
          <div className="mb-6 fade-up stagger-1">
            <label className="text-sm font-medium mb-2 block">Sélectionner une offre</label>
            <select
              value={selectedOffre}
              onChange={e => setSelectedOffre(Number(e.target.value))}
              className="px-4 py-3 glass rounded-btn text-sm outline-none w-full max-w-md"
            >
              {mesOffres.map(o => (
                <option key={o.id} value={o.id}>{o.titre} ({CANDIDATURES.filter(c => c.offre_id === o.id).length} candidatures)</option>
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

          <p className="text-sm text-muted-foreground mb-4">{filtered.length} candidature{filtered.length > 1 ? "s" : ""}</p>

          {/* Candidate Cards */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((candidature, i) => {
                const candidat = CANDIDATS.find(c => c.id === candidature.candidat_id);
                if (!candidat) return null;
                return (
                  <div key={candidature.id} className={`glass rounded-card p-5 card-hover fade-up stagger-${(i % 6) + 1}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-bold text-primary text-sm">{candidat.prenom[0]}{candidat.nom[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{candidat.prenom} {candidat.nom}</h3>
                        <p className="text-sm text-muted-foreground">{candidat.email} · {candidat.ville}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{formatDate(candidature.date_postulation)}</span>
                        <Badge
                          text={candidature.statut === "acceptee" ? "Acceptée" : candidature.statut === "refusee" ? "Refusée" : "En attente"}
                          variant={candidature.statut === "acceptee" ? "success" : candidature.statut === "refusee" ? "destructive" : "warning"}
                        />
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground"><User size={16} /></button>
                        <button className="p-2 rounded-btn bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"><CheckCircle size={16} /></button>
                        <button className="p-2 rounded-btn bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"><XCircle size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
