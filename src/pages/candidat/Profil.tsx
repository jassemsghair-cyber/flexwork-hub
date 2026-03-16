import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CANDIDATS } from "@/lib/data";
import { Upload, X, Plus } from "lucide-react";

export default function CandidatProfil() {
  const candidat = CANDIDATS[0];
  const [competences, setCompetences] = useState(candidat.competences);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !competences.includes(newTag.trim())) {
      setCompetences([...competences, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setCompetences(competences.filter(c => c !== tag));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const completion = 75;

  return (
    <div className="min-h-screen">
      <Navbar userRole="candidat" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 fade-up">
            <span className="hover:text-foreground cursor-pointer">Accueil</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Mon profil</span>
          </nav>

          {/* Profile Hero */}
          <div className="glass rounded-card p-6 mb-8 fade-up stagger-1">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-2xl">
                  {candidat.prenom[0]}{candidat.nom[0]}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading font-bold text-2xl">{candidat.prenom} {candidat.nom}</h1>
                <p className="text-muted-foreground text-sm">{candidat.email}</p>
              </div>
              <div className="w-48">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Profil complété</span>
                  <span className="font-medium text-primary">{completion}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Personal Info */}
            <div className="glass rounded-card p-6 fade-up stagger-2">
              <h2 className="font-heading font-semibold text-lg mb-6">Informations personnelles</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom</label>
                  <input defaultValue={candidat.nom} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Prénom</label>
                  <input defaultValue={candidat.prenom} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input defaultValue={candidat.email} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Téléphone</label>
                  <input defaultValue={candidat.telephone} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ville</label>
                  <input defaultValue={candidat.ville} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            {/* Right: Professional Info */}
            <div className="space-y-8">
              <div className="glass rounded-card p-6 fade-up stagger-3">
                <h2 className="font-heading font-semibold text-lg mb-6">Disponibilités</h2>
                <div className="flex flex-wrap gap-3">
                  {["Matin", "Soir", "Weekend", "Flexible"].map(d => (
                    <label key={d} className="flex items-center gap-2 px-4 py-2 glass rounded-btn cursor-pointer text-sm">
                      <input type="checkbox" defaultChecked={candidat.disponibilites.includes(d)} className="accent-primary" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass rounded-card p-6 fade-up stagger-4">
                <h2 className="font-heading font-semibold text-lg mb-6">Compétences</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {competences.map(c => (
                    <span key={c} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                      {c}
                      <button onClick={() => removeTag(c)} className="hover:text-destructive"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Ajouter une compétence..."
                    className="flex-1 px-4 py-2 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button onClick={addTag} className="px-3 py-2 bg-primary text-primary-foreground rounded-btn btn-press">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CV Upload */}
              <div className="glass rounded-card p-6 fade-up stagger-5">
                <h2 className="font-heading font-semibold text-lg mb-6">Curriculum Vitae</h2>
                <div className="border-2 border-dashed border-border rounded-card p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Glissez votre CV ici ou <span className="text-primary">parcourir</span></p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 5MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end fade-up stagger-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
