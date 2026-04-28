import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usersApi, AuthUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const DISPOS = ["Matin", "Soir", "Weekend", "Flexible"];

export default function CandidatProfil() {
  const { user: sessionUser, updateUser } = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");
  const [disponibilites, setDisponibilites] = useState<string[]>([]);
  const [competences, setCompetences] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!sessionUser) {
      // Fallback démo
      const fakeUser: AuthUser = {
        id: 0, name: `Yasmine Ben Ali`, email: "yasmine.benali@email.tn",
        role: "candidat", statut: "actif", telephone: "+216 55 123 456", ville: "Tunis",
        disponibilites: ["Soir", "Weekend"], competences: ["Service client", "Communication", "Anglais"],
      };
      setUser(fakeUser);
      setError("Mode démo — connectez-vous pour modifier votre vrai profil.");
      hydrate(fakeUser);
      setLoading(false);
      return;
    }
    usersApi.getProfile(sessionUser.id)
      .then((data) => { setUser(data.user); hydrate(data.user); })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id]);

  const hydrate = (u: AuthUser) => {
    setName(u.name); setEmail(u.email);
    setTelephone(u.telephone || ""); setVille(u.ville || "");
    setDisponibilites(u.disponibilites || []); setCompetences(u.competences || []);
  };

  const addTag = () => {
    const v = newTag.trim();
    if (v && !competences.includes(v)) { setCompetences([...competences, v]); setNewTag(""); }
  };
  const removeTag = (t: string) => setCompetences(competences.filter((c) => c !== t));
  const toggleDispo = (d: string) =>
    setDisponibilites((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const handleSave = async () => {
    if (!user || user.id === 0) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour enregistrer.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const data = await usersApi.updateProfile({
        id: user.id, name, email, telephone, ville,
        disponibilites, competences,
      });
      setUser(data.user);
      updateUser(data.user);
      setShowSuccess(true);
    } catch (e) {
      toast({ title: "Erreur", description: e instanceof Error ? e.message : "Impossible", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const completion = Math.min(100, Math.round(
    ([name, email, telephone, ville].filter(Boolean).length * 15) +
    (disponibilites.length > 0 ? 20 : 0) +
    (competences.length > 0 ? 20 : 0)
  ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const initials = (name || "??").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen">
      <Navbar userRole="candidat" />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-6 fade-up">
            <span className="hover:text-foreground cursor-pointer">Accueil</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Mon profil</span>
          </nav>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-btn bg-warning/10 border border-warning/30 text-warning text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Profile Hero */}
          <div className="glass rounded-card p-6 mb-8 fade-up stagger-1">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-2xl">{initials}</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading font-bold text-2xl">{name}</h1>
                <p className="text-muted-foreground text-sm">{email}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-card p-6 fade-up stagger-2">
              <h2 className="font-heading font-semibold text-lg mb-6">Informations personnelles</h2>
              <div className="space-y-4">
                <Field label="Nom complet" value={name} onChange={setName} />
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Téléphone" value={telephone} onChange={setTelephone} />
                <Field label="Ville" value={ville} onChange={setVille} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass rounded-card p-6 fade-up stagger-3">
                <h2 className="font-heading font-semibold text-lg mb-6">Disponibilités</h2>
                <div className="flex flex-wrap gap-3">
                  {DISPOS.map((d) => (
                    <label key={d} className="flex items-center gap-2 px-4 py-2 glass rounded-btn cursor-pointer text-sm">
                      <input type="checkbox" checked={disponibilites.includes(d)} onChange={() => toggleDispo(d)} className="accent-primary" /> {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass rounded-card p-6 fade-up stagger-4">
                <h2 className="font-heading font-semibold text-lg mb-6">Compétences</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {competences.map((c) => (
                    <span key={c} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                      {c}
                      <button onClick={() => removeTag(c)} className="hover:text-destructive"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newTag} onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Ajouter une compétence..."
                    className="flex-1 px-4 py-2 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button onClick={addTag} className="px-3 py-2 bg-primary text-primary-foreground rounded-btn btn-press">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

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

          <div className="mt-8 flex justify-end fade-up stagger-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? (<><Loader2 size={16} className="animate-spin" /> Enregistrement...</>) : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Success Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 fade-up" style={{ animationDuration: "0.2s" }}>
          <div className="glass-strong rounded-card p-8 max-w-sm w-full text-center shadow-2xl border-success/30 relative" style={{ animation: "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-success w-10 h-10" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2 text-foreground">Profil mis à jour !</h3>
            <p className="text-muted-foreground mb-8">
              Vos informations ont été enregistrées avec succès.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-muted/50 rounded-btn text-sm outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}
