import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { OFFRES, SECTEURS } from "@/lib/data";
import { Search, MapPin, Briefcase, ArrowRight, UserPlus, Send, CheckCircle, Star, Quote } from "lucide-react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-heading font-bold text-3xl md:text-4xl">{count}{suffix}</div>;
}

export default function Index() {
  const featuredJobs = OFFRES.filter(o => o.statut === "active").slice(0, 6);

  const sectorCounts = SECTEURS.map(s => ({
    name: s,
    count: OFFRES.filter(o => o.secteur === s).length
  }));

  const steps = [
    { icon: <UserPlus size={28} />, title: "Inscrivez-vous", desc: "Créez votre profil en quelques minutes, que vous soyez candidat ou employeur." },
    { icon: <Send size={28} />, title: "Postulez", desc: "Parcourez les offres et envoyez votre candidature en un clic." },
    { icon: <CheckCircle size={28} />, title: "Travaillez", desc: "Décrochez votre emploi à temps partiel et commencez à gagner." },
  ];

  const testimonials = [
    { name: "Yasmine B.", role: "Étudiante, Tunis", quote: "Grâce à FlexWork, j'ai trouvé un job de serveuse le weekend qui me permet de financer mes études. Simple et rapide !" },
    { name: "Karim M.", role: "Gérant, Café Médina", quote: "On trouve facilement des profils motivés pour nos shifts du soir. La plateforme nous fait gagner un temps précieux." },
    { name: "Fatma G.", role: "Vendeuse, Sfax", quote: "L'interface est super intuitive. J'ai postulé à 3 offres en 10 minutes et j'ai eu une réponse le lendemain." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="gradient-blob w-[500px] h-[500px] bg-primary/30 -top-40 -right-40" />
        <div className="gradient-blob w-[400px] h-[400px] bg-success/20 -bottom-20 -left-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight fade-up">
              Trouvez votre job{" "}
              <span className="text-primary">idéal</span> à temps partiel
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mt-6 max-w-2xl mx-auto fade-up stagger-1">
              La première plateforme tunisienne dédiée aux emplois à temps partiel. Candidats et employeurs, connectez-vous en un clic.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto fade-up stagger-2">
            <div className="glass-strong rounded-card p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-btn">
                <Search size={18} className="text-muted-foreground" />
                <input type="text" placeholder="Titre du poste..." className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-btn">
                <MapPin size={18} className="text-muted-foreground" />
                <select className="bg-transparent text-sm outline-none text-muted-foreground">
                  <option>Toutes les villes</option>
                  <option>Tunis</option>
                  <option>Sousse</option>
                  <option>Sfax</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-btn">
                <Briefcase size={18} className="text-muted-foreground" />
                <select className="bg-transparent text-sm outline-none text-muted-foreground">
                  <option>Tous les secteurs</option>
                  {SECTEURS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Link to="/offres" className="px-6 py-3 bg-primary text-primary-foreground rounded-btn font-medium text-sm btn-press hover:opacity-90 transition-opacity text-center whitespace-nowrap">
                Rechercher
              </Link>
            </div>
          </div>

          {/* Counters */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto text-center fade-up stagger-3">
            <div>
              <Counter target={500} suffix="+" />
              <p className="text-sm text-muted-foreground mt-1">Offres</p>
            </div>
            <div>
              <Counter target={1200} suffix="+" />
              <p className="text-sm text-muted-foreground mt-1">Candidats</p>
            </div>
            <div>
              <Counter target={350} suffix="+" />
              <p className="text-sm text-muted-foreground mt-1">Entreprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-4 fade-up">Comment ça marche</h2>
          <p className="text-center text-muted-foreground mb-12 fade-up stagger-1">Trois étapes simples pour trouver votre prochain emploi</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className={`glass rounded-card p-8 text-center card-hover fade-up stagger-${i + 2}`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
                  {step.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">Offres à la une</h2>
              <p className="text-muted-foreground mt-2">Découvrez les dernières opportunités</p>
            </div>
            <Link to="/offres" className="hidden sm:flex items-center gap-2 text-primary text-sm font-medium hover:opacity-80 transition-opacity">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((offre, i) => (
              <JobCard key={offre.id} offre={offre} className={`fade-up stagger-${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">Secteurs populaires</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sectorCounts.map(({ name, count }) => (
              <Link
                key={name}
                to={`/offres?secteur=${name}`}
                className="glass rounded-full px-5 py-2.5 text-sm font-medium card-hover flex items-center gap-2"
              >
                {name}
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">Ce qu'ils en disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass rounded-card p-6 card-hover fade-up stagger-${i + 1}`}>
                <Quote size={24} className="text-primary/40 mb-4" />
                <p className="text-sm text-muted-foreground mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass rounded-card p-12 relative overflow-hidden">
          <div className="gradient-blob w-[300px] h-[300px] bg-primary/40 -top-20 -right-20" />
          <div className="gradient-blob w-[200px] h-[200px] bg-success/30 -bottom-10 -left-10" />
          <div className="relative z-10">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Prêt à commencer ?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez des milliers de tunisiens qui utilisent FlexWork pour trouver des opportunités à temps partiel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 bg-primary text-primary-foreground rounded-btn font-medium btn-press hover:opacity-90 transition-opacity">
                Créer un compte
              </Link>
              <Link to="/offres" className="px-8 py-3 bg-muted text-foreground rounded-btn font-medium btn-press hover:bg-muted/80 transition-colors">
                Voir les offres
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
