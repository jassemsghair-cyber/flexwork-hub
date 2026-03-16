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

export const OFFRES: Offre[] = [
  {
    id: 1,
    titre: "Serveur / Serveuse",
    entreprise: "Café Médina",
    logo: "CM",
    lieu: "Tunis Centre",
    secteur: "Restauration",
    salaire: 800,
    horaire: "Soir (18h-23h)",
    type: "Temps partiel",
    description: "Nous recherchons un(e) serveur/serveuse dynamique pour rejoindre notre équipe au cœur de la Médina de Tunis. Vous serez responsable de l'accueil des clients, de la prise de commandes et du service en salle. Ambiance chaleureuse et équipe conviviale.",
    competences: ["Service client", "Rapidité", "Travail en équipe"],
    date_publication: "2025-03-10",
    statut: "active"
  },
  {
    id: 2,
    titre: "Vendeur en boutique",
    entreprise: "Mode & Style",
    logo: "MS",
    lieu: "La Marsa",
    secteur: "Commerce",
    salaire: 650,
    horaire: "Weekend (Sam-Dim)",
    type: "Temps partiel",
    description: "Boutique de prêt-à-porter haut de gamme à La Marsa recherche un(e) vendeur/vendeuse pour les weekends. Vous conseillerez la clientèle, gérerez les stocks et maintiendrez la présentation du magasin.",
    competences: ["Vente", "Communication", "Sens du style"],
    date_publication: "2025-03-08",
    statut: "active"
  },
  {
    id: 3,
    titre: "Livreur à vélo",
    entreprise: "Livraison Express TN",
    logo: "LE",
    lieu: "Lac 1, Tunis",
    secteur: "Livraison",
    salaire: 900,
    horaire: "Flexible",
    type: "Temps partiel",
    description: "Rejoignez notre flotte de livreurs à vélo dans la zone du Lac. Horaires flexibles, vous choisissez vos créneaux. Rémunération attractive avec primes sur les livraisons.",
    competences: ["Ponctualité", "Orientation", "Endurance physique"],
    date_publication: "2025-03-12",
    statut: "active"
  },
  {
    id: 4,
    titre: "Professeur d'anglais",
    entreprise: "TutorTN Academy",
    logo: "TA",
    lieu: "En ligne",
    secteur: "Tutorat",
    salaire: 1200,
    horaire: "Soir (17h-20h)",
    type: "Temps partiel",
    description: "Donnez des cours d'anglais en ligne à des étudiants tunisiens. Niveaux débutant à intermédiaire. Matériel pédagogique fourni. Minimum 3 séances par semaine.",
    competences: ["Anglais courant", "Pédagogie", "Patience"],
    date_publication: "2025-03-05",
    statut: "active"
  },
  {
    id: 5,
    titre: "Développeur Web Junior",
    entreprise: "DigitalFlow",
    logo: "DF",
    lieu: "Technopole El Ghazala",
    secteur: "Informatique",
    salaire: 1500,
    horaire: "Matin (9h-13h)",
    type: "Temps partiel",
    description: "Startup tech recherche un développeur web junior pour travailler sur des projets React/Node.js. Environnement agile, mentorat par des seniors. Possibilité d'évolution vers un poste à plein temps.",
    competences: ["React", "JavaScript", "Git"],
    date_publication: "2025-03-11",
    statut: "active"
  },
  {
    id: 6,
    titre: "Hôte/Hôtesse d'accueil",
    entreprise: "Events Plus",
    logo: "EP",
    lieu: "Gammarth",
    secteur: "Événementiel",
    salaire: 700,
    horaire: "Weekend (Sam-Dim)",
    type: "Temps partiel",
    description: "Agence événementielle recherche des hôtes et hôtesses pour des événements corporate et privés dans la région de Gammarth. Présentation soignée exigée.",
    competences: ["Présentation", "Communication", "Français courant"],
    date_publication: "2025-03-07",
    statut: "active"
  },
  {
    id: 7,
    titre: "Assistant(e) administratif",
    entreprise: "Cabinet Conseil RH",
    logo: "CR",
    lieu: "Centre Urbain Nord",
    secteur: "Administratif",
    salaire: 950,
    horaire: "Matin (8h-12h)",
    type: "Temps partiel",
    description: "Cabinet de conseil en ressources humaines recherche un(e) assistant(e) pour la gestion administrative : classement, saisie de données, accueil téléphonique et organisation de rendez-vous.",
    competences: ["Organisation", "Word/Excel", "Communication"],
    date_publication: "2025-03-09",
    statut: "active"
  },
  {
    id: 8,
    titre: "Aide-soignant(e)",
    entreprise: "Clinique Les Jasmins",
    logo: "CJ",
    lieu: "Sousse",
    secteur: "Santé",
    salaire: 1100,
    horaire: "Matin (6h-12h)",
    type: "Temps partiel",
    description: "La Clinique Les Jasmins à Sousse recrute un(e) aide-soignant(e) pour les shifts du matin. Vous assisterez l'équipe médicale dans les soins quotidiens aux patients.",
    competences: ["Soins de base", "Empathie", "Résistance au stress"],
    date_publication: "2025-03-06",
    statut: "active"
  },
  {
    id: 9,
    titre: "Community Manager",
    entreprise: "MediaLab TN",
    logo: "ML",
    lieu: "En ligne",
    secteur: "Médias",
    salaire: 1000,
    horaire: "Flexible",
    type: "Temps partiel",
    description: "Agence digitale recherche un community manager freelance pour gérer les réseaux sociaux de 3 marques tunisiennes. Création de contenu, planning éditorial et reporting mensuel.",
    competences: ["Réseaux sociaux", "Création de contenu", "Canva"],
    date_publication: "2025-03-13",
    statut: "active"
  },
  {
    id: 10,
    titre: "Caissier/Caissière",
    entreprise: "Supermarché Azur",
    logo: "SA",
    lieu: "Sfax",
    secteur: "Commerce",
    salaire: 600,
    horaire: "Soir (16h-21h)",
    type: "Temps partiel",
    description: "Supermarché Azur à Sfax recrute un(e) caissier/caissière pour les shifts du soir. Manipulation d'espèces, scan de produits et service client.",
    competences: ["Calcul rapide", "Patience", "Service client"],
    date_publication: "2025-03-04",
    statut: "active"
  },
  {
    id: 11,
    titre: "Photographe événementiel",
    entreprise: "CaptureTN",
    logo: "CT",
    lieu: "Tunis",
    secteur: "Médias",
    salaire: 1300,
    horaire: "Weekend (Sam-Dim)",
    type: "Temps partiel",
    description: "Studio photo recherche un photographe pour couvrir des mariages et événements les weekends. Matériel professionnel requis. Post-production incluse.",
    competences: ["Photographie", "Lightroom", "Créativité"],
    date_publication: "2025-03-14",
    statut: "en_attente"
  },
  {
    id: 12,
    titre: "Barista",
    entreprise: "Brew House Café",
    logo: "BH",
    lieu: "Sidi Bou Saïd",
    secteur: "Restauration",
    salaire: 750,
    horaire: "Matin (7h-12h)",
    type: "Temps partiel",
    description: "Café artisanal à Sidi Bou Saïd cherche un(e) barista passionné(e) par le café de spécialité. Formation assurée sur nos méthodes d'extraction.",
    competences: ["Café", "Service client", "Propreté"],
    date_publication: "2025-03-15",
    statut: "active"
  },
];

export const CANDIDATS: Candidat[] = [
  {
    id: 1,
    nom: "Ben Ali",
    prenom: "Yasmine",
    email: "yasmine.benali@email.tn",
    telephone: "+216 55 123 456",
    ville: "Tunis",
    disponibilites: ["Soir", "Weekend"],
    competences: ["Service client", "Communication", "Anglais"],
    cv: "yasmine_benali_cv.pdf",
    date_inscription: "2025-02-15",
    statut: "actif"
  },
  {
    id: 2,
    nom: "Trabelsi",
    prenom: "Ahmed",
    email: "ahmed.trabelsi@email.tn",
    telephone: "+216 98 765 432",
    ville: "Sousse",
    disponibilites: ["Matin", "Flexible"],
    competences: ["React", "JavaScript", "Node.js", "Git"],
    cv: "ahmed_trabelsi_cv.pdf",
    date_inscription: "2025-02-20",
    statut: "actif"
  },
  {
    id: 3,
    nom: "Gharbi",
    prenom: "Fatma",
    email: "fatma.gharbi@email.tn",
    telephone: "+216 22 334 556",
    ville: "Sfax",
    disponibilites: ["Matin", "Soir"],
    competences: ["Vente", "Gestion de caisse", "Organisation"],
    cv: "fatma_gharbi_cv.pdf",
    date_inscription: "2025-03-01",
    statut: "actif"
  },
  {
    id: 4,
    nom: "Jebali",
    prenom: "Mohamed",
    email: "mohamed.jebali@email.tn",
    telephone: "+216 50 112 233",
    ville: "La Marsa",
    disponibilites: ["Weekend"],
    competences: ["Photographie", "Lightroom", "Créativité"],
    cv: "mohamed_jebali_cv.pdf",
    date_inscription: "2025-03-05",
    statut: "actif"
  },
  {
    id: 5,
    nom: "Khelifi",
    prenom: "Nour",
    email: "nour.khelifi@email.tn",
    telephone: "+216 29 445 667",
    ville: "Tunis",
    disponibilites: ["Soir", "Flexible"],
    competences: ["Réseaux sociaux", "Canva", "Rédaction"],
    cv: "nour_khelifi_cv.pdf",
    date_inscription: "2025-01-10",
    statut: "bloque"
  }
];

export const EMPLOYEURS: Employeur[] = [
  {
    id: 1,
    entreprise: "Café Médina",
    secteur: "Restauration",
    email: "contact@cafemedina.tn",
    telephone: "+216 71 234 567",
    logo: "CM",
    date_inscription: "2025-01-05",
    statut: "actif"
  },
  {
    id: 2,
    entreprise: "DigitalFlow",
    secteur: "Informatique",
    email: "rh@digitalflow.tn",
    telephone: "+216 71 890 123",
    logo: "DF",
    date_inscription: "2025-01-20",
    statut: "actif"
  },
  {
    id: 3,
    entreprise: "Events Plus",
    secteur: "Événementiel",
    email: "info@eventsplus.tn",
    telephone: "+216 71 456 789",
    logo: "EP",
    date_inscription: "2025-02-10",
    statut: "actif"
  },
  {
    id: 4,
    entreprise: "MediaLab TN",
    secteur: "Médias",
    email: "jobs@medialabn.tn",
    telephone: "+216 71 567 890",
    logo: "ML",
    date_inscription: "2025-02-28",
    statut: "actif"
  }
];

export const CANDIDATURES: Candidature[] = [
  { id: 1, candidat_id: 1, offre_id: 1, date_postulation: "2025-03-11", statut: "acceptee" },
  { id: 2, candidat_id: 1, offre_id: 6, date_postulation: "2025-03-12", statut: "en_attente" },
  { id: 3, candidat_id: 2, offre_id: 5, date_postulation: "2025-03-12", statut: "acceptee" },
  { id: 4, candidat_id: 2, offre_id: 9, date_postulation: "2025-03-13", statut: "en_attente" },
  { id: 5, candidat_id: 3, offre_id: 10, date_postulation: "2025-03-05", statut: "refusee" },
  { id: 6, candidat_id: 3, offre_id: 2, date_postulation: "2025-03-09", statut: "en_attente" },
  { id: 7, candidat_id: 4, offre_id: 11, date_postulation: "2025-03-14", statut: "en_attente" },
  { id: 8, candidat_id: 4, offre_id: 6, date_postulation: "2025-03-10", statut: "acceptee" },
  { id: 9, candidat_id: 5, offre_id: 9, date_postulation: "2025-03-13", statut: "refusee" },
  { id: 10, candidat_id: 1, offre_id: 12, date_postulation: "2025-03-15", statut: "en_attente" },
];

export const SECTEURS = [
  "Restauration", "Commerce", "Livraison", "Tutorat",
  "Informatique", "Événementiel", "Administratif", "Santé", "Médias"
];

export const VILLES = [
  "Tunis Centre", "La Marsa", "Lac 1, Tunis", "En ligne",
  "Technopole El Ghazala", "Gammarth", "Centre Urbain Nord",
  "Sousse", "Sfax", "Sidi Bou Saïd"
];

export const HORAIRES = ["Matin", "Soir", "Weekend", "Flexible"];

export function getOffre(id: number) {
  return OFFRES.find(o => o.id === id);
}

export function getCandidat(id: number) {
  return CANDIDATS.find(c => c.id === id);
}

export function getCandidaturesForOffre(offreId: number) {
  return CANDIDATURES.filter(c => c.offre_id === offreId);
}

export function getCandidaturesForCandidat(candidatId: number) {
  return CANDIDATURES.filter(c => c.candidat_id === candidatId);
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
