import { Link } from "react-router-dom";
import { type Offre, formatSalaire } from "@/lib/data";
import { MapPin, Clock, Briefcase } from "lucide-react";

interface JobCardProps {
  offre: Offre;
  className?: string;
}

export default function JobCard({ offre, className = "" }: JobCardProps) {
  return (
    <Link
      to={`/offre/${offre.id}`}
      className={`block glass rounded-card p-5 card-hover group ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-btn bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <span className="font-heading font-bold text-primary text-sm">{offre.logo}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {offre.titre}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{offre.entreprise}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Briefcase size={12} /> {offre.secteur}
        </span>
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          <Clock size={12} /> {offre.horaire}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} /> {offre.lieu}
        </div>
        <span className="font-heading font-bold text-success text-sm">{formatSalaire(offre.salaire)}</span>
      </div>
    </Link>
  );
}
