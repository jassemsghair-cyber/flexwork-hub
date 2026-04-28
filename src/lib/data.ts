export interface Offre {
  id: number;
  titre: string;
  entreprise: string;
  logo: string;
  lieu: string;
  secteur: string;
  salaire: number;
  horaire: string;
  type: string;
  description: string;
  competences: string[];
  date_publication: string;
  statut: "active" | "en_attente" | "rejetee";
}

export interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
  disponibilites: string[];
  competences: string[];
  cv: string;
  date_inscription: string;
  statut: "actif" | "bloque";
}

export interface Employeur {
  id: number;
  entreprise: string;
  secteur: string;
  email: string;
  telephone: string;
  logo: string;
  date_inscription: string;
  statut: "actif" | "bloque";
}

export interface Candidature {
  id: number;
  candidat_id: number;
  offre_id: number;
  date_postulation: string;
  statut: "en_attente" | "acceptee" | "refusee";
}



export function formatSalaire(amount: number) {
  return `${amount} DT/mois`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-TN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
