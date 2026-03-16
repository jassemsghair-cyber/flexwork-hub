import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Navbar />

      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary/20 via-background to-success/10">
        <div className="gradient-blob w-[400px] h-[400px] bg-primary/30 top-20 -left-20" />
        <div className="gradient-blob w-[300px] h-[300px] bg-success/20 bottom-20 right-10" />
        <div className="relative z-10 p-12 text-center max-w-md">
          <h2 className="font-heading font-bold text-4xl mb-4">Bienvenue sur FlexWork</h2>
          <p className="text-muted-foreground">La plateforme qui connecte les talents tunisiens aux meilleures opportunités à temps partiel.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 pt-24">
        <div className="w-full max-w-md fade-up">
          <h1 className="font-heading font-bold text-3xl mb-2">Connexion</h1>
          <p className="text-muted-foreground mb-8">Connectez-vous à votre compte FlexWork</p>

          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 glass rounded-btn focus-within:ring-2 focus-within:ring-primary/50">
                <Mail size={18} className="text-muted-foreground" />
                <input type="email" placeholder="votre@email.tn" className="bg-transparent text-sm w-full outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mot de passe</label>
              <div className="flex items-center gap-2 px-4 py-3 glass rounded-btn focus-within:ring-2 focus-within:ring-primary/50">
                <Lock size={18} className="text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="bg-transparent text-sm w-full outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-sm text-primary hover:opacity-80">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity">
              Se connecter
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou continuer avec</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 glass rounded-btn text-sm font-medium btn-press hover:bg-muted/50 transition-colors">
              Google
            </button>
            <button className="py-3 glass rounded-btn text-sm font-medium btn-press hover:bg-muted/50 transition-colors">
              LinkedIn
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary hover:opacity-80">Inscrivez-vous</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Connexion unique pour candidats et employeurs
          </p>
        </div>
      </div>
    </div>
  );
}
