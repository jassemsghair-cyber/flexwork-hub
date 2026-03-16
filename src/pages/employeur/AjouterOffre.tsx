import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { SECTEURS, VILLES, HORAIRES } from "@/lib/data";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";

export default function AjouterOffre() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    titre: "", secteur: "", type: "Temps partiel", lieu: "",
    description: "", competences: [] as string[], horaires: [] as string[],
    salaire: 800,
  });
  const [tagInput, setTagInput] = useState("");

  const updateForm = (key: string, value: any) => setForm({ ...form, [key]: value });

  const addCompetence = () => {
    if (tagInput.trim() && !form.competences.includes(tagInput.trim())) {
      updateForm("competences", [...form.competences, tagInput.trim()]);
      setTagInput("");
    }
  };

  const toggleHoraire = (h: string) => {
    updateForm("horaires", form.horaires.includes(h) ? form.horaires.filter(x => x !== h) : [...form.horaires, h]);
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="employeur" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-3xl mb-2 fade-up">Publier une offre</h1>
          <p className="text-muted-foreground mb-8 fade-up stagger-1">Remplissez les informations en 3 étapes simples</p>

          {/* Step Bar */}
          <div className="flex items-center gap-2 mb-10 fade-up stagger-2">
            {["Informations", "Détails", "Aperçu"].map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > i + 1 ? "bg-success text-success-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{i + 1}</div>
                <span className={`text-sm hidden sm:block ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-success" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="glass rounded-card p-8 space-y-5 fade-up">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre du poste</label>
                <input value={form.titre} onChange={e => updateForm("titre", e.target.value)} placeholder="ex: Serveur / Serveuse" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Secteur</label>
                <select value={form.secteur} onChange={e => updateForm("secteur", e.target.value)} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none">
                  <option value="">Sélectionner</option>
                  {SECTEURS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Lieu</label>
                <select value={form.lieu} onChange={e => updateForm("lieu", e.target.value)} className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none">
                  <option value="">Sélectionner</option>
                  {VILLES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="glass rounded-card p-8 space-y-5 fade-up">
              <div>
                <label className="text-sm font-medium mb-2 block">Description du poste</label>
                <textarea value={form.description} onChange={e => updateForm("description", e.target.value)} rows={5} placeholder="Décrivez le poste en détail..." className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Compétences requises</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.competences.map(c => (
                    <span key={c} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm flex items-center gap-1">
                      {c}
                      <button onClick={() => updateForm("competences", form.competences.filter(x => x !== c))} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCompetence())} placeholder="Ajouter..." className="flex-1 px-4 py-2 bg-muted/50 rounded-btn text-sm outline-none" />
                  <button onClick={addCompetence} className="px-4 py-2 bg-primary text-primary-foreground rounded-btn text-sm btn-press">+</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Horaires</label>
                <div className="flex flex-wrap gap-3">
                  {HORAIRES.map(h => (
                    <label key={h} className="flex items-center gap-2 px-4 py-2 glass rounded-btn cursor-pointer text-sm">
                      <input type="checkbox" checked={form.horaires.includes(h)} onChange={() => toggleHoraire(h)} className="accent-primary" /> {h}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Salaire: {form.salaire} DT/mois</label>
                <input type="range" min={300} max={2000} step={50} value={form.salaire} onChange={e => updateForm("salaire", Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>300 DT</span><span>2000 DT</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 fade-up">
              <div className="glass rounded-card p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Eye size={20} className="text-primary" />
                  <h2 className="font-heading font-semibold text-lg">Aperçu de l'offre</h2>
                </div>
                <div className="glass rounded-card p-6 border border-primary/10">
                  <h3 className="font-heading font-bold text-xl mb-1">{form.titre || "Titre du poste"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{form.lieu || "Lieu"} · {form.secteur || "Secteur"}</p>
                  <p className="text-sm text-muted-foreground mb-4">{form.description || "Description du poste..."}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.competences.map(c => (
                      <span key={c} className="px-3 py-1 bg-muted rounded-full text-sm">{c}</span>
                    ))}
                  </div>
                  <p className="font-heading font-bold text-success text-lg">{form.salaire} DT/mois</p>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" />
                Je confirme que les informations sont correctes
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} /> Précédent
              </button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press">
                Suivant <ArrowRight size={16} />
              </button>
            ) : (
              <button className="px-8 py-3 bg-success text-success-foreground rounded-btn font-medium btn-press hover:opacity-90">
                Publier l'offre
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
