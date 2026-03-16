import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { OFFRES, CANDIDATURES, formatDate, formatSalaire } from "@/lib/data";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function MesOffres() {
  const mesOffres = OFFRES.filter(o => ["Café Médina", "Brew House Café"].includes(o.entreprise));

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

          <div className="space-y-4">
            {mesOffres.map((offre, i) => {
              const candidatureCount = CANDIDATURES.filter(c => c.offre_id === offre.id).length;
              return (
                <div key={offre.id} className={`glass rounded-card p-6 card-hover fade-up stagger-${(i % 6) + 1}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-btn bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-primary text-sm">{offre.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold">{offre.titre}</h3>
                      <p className="text-sm text-muted-foreground">{offre.lieu} · {formatSalaire(offre.salaire)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{candidatureCount} candidature{candidatureCount > 1 ? "s" : ""}</span>
                      <Badge text={offre.statut === "active" ? "Active" : "En attente"} variant={offre.statut === "active" ? "success" : "warning"} />
                      <div className="flex gap-2">
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-foreground transition-colors"><Edit size={16} /></button>
                        <button className="p-2 glass rounded-btn text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
