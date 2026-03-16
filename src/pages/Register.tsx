import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { User, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { SECTEURS } from "@/lib/data";

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"candidat" | "employeur" | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl fade-up">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {s}
                </div>
                <span className={`text-sm hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Choisir votre rôle" : "Vos informations"}
                </span>
                {s === 1 && <div className={`w-16 h-0.5 ${step > 1 ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="font-heading font-bold text-3xl mb-2">Rejoignez FlexWork</h1>
                <p className="text-muted-foreground">Comment souhaitez-vous utiliser la plateforme ?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setRole("candidat")}
                  className={`glass rounded-card p-8 text-left transition-all btn-press ${
                    role === "candidat" ? "ring-2 ring-primary border-primary/30 shadow-[0_0_30px_rgba(108,99,255,0.15)]" : "hover:border-white/[0.1]"
                  }`}
                >
                  <div className="w-14 h-14 rounded-card bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
                    <User size={28} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Candidat</h3>
                  <p className="text-sm text-muted-foreground">Je cherche un emploi à temps partiel</p>
                </button>

                <button
                  onClick={() => setRole("employeur")}
                  className={`glass rounded-card p-8 text-left transition-all btn-press ${
                    role === "employeur" ? "ring-2 ring-primary border-primary/30 shadow-[0_0_30px_rgba(108,99,255,0.15)]" : "hover:border-white/[0.1]"
                  }`}
                >
                  <div className="w-14 h-14 rounded-card bg-success/10 border border-success/20 flex items-center justify-center mb-4 text-success">
                    <Building2 size={28} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Employeur</h3>
                  <p className="text-sm text-muted-foreground">Je souhaite publier des offres d'emploi</p>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="font-heading font-bold text-3xl mb-2">
                  {role === "candidat" ? "Créez votre profil candidat" : "Créez votre compte employeur"}
                </h1>
                <p className="text-muted-foreground">Remplissez vos informations pour commencer</p>
              </div>

              <form className="glass rounded-card p-8 space-y-5" onSubmit={e => e.preventDefault()}>
                {role === "candidat" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nom</label>
                        <input type="text" placeholder="Ben Ali" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Prénom</label>
                        <input type="text" placeholder="Yasmine" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <input type="email" placeholder="yasmine@email.tn" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mot de passe</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Disponibilités</label>
                      <div className="flex flex-wrap gap-3">
                        {["Matin", "Soir", "Weekend", "Flexible"].map(d => (
                          <label key={d} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded accent-primary" /> {d}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nom de l'entreprise</label>
                      <input type="text" placeholder="Mon Entreprise" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Secteur d'activité</label>
                      <select className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">Sélectionner un secteur</option>
                        {SECTEURS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email professionnel</label>
                      <input type="email" placeholder="contact@entreprise.tn" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mot de passe</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Téléphone</label>
                      <input type="tel" placeholder="+216 XX XXX XXX" className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} /> Retour
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity"
                  >
                    Créer mon compte
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Déjà inscrit ?{" "}
                <Link to="/login" className="text-primary hover:opacity-80">Connectez-vous</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
