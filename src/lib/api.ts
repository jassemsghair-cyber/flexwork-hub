// API client — points to the local PHP backend.
// Override at runtime with:  localStorage.setItem('flexwork_api', 'http://localhost/flexwork-backend')

export const API_BASE: string =
  (typeof window !== "undefined" && localStorage.getItem("flexwork_api")) ||
  "http://localhost/flexwork-backend";

type ApiResponse<T> = { success: boolean; message: string } & T;

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Réponse invalide (${res.status})`);
  }
  if (!res.ok || (data as { success?: boolean })?.success === false) {
    const msg = (data as { message?: string })?.message || `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return data as ApiResponse<T>;
}

const get = <T,>(p: string) => request<T>(p, { method: "GET" });
const post = <T,>(p: string, body: unknown) =>
  request<T>(p, { method: "POST", body: JSON.stringify(body) });

// ============ Candidatures ============
export interface ApiCandidatureCandidate {
  id: number;
  job_id: number;
  candidat_id: number;
  statut: "en_attente" | "acceptee" | "refusee";
  message: string | null;
  date_postulation: string;
  offre_titre: string;
  entreprise: string;
  lieu: string;
  secteur: string;
  salaire: string;
  horaire: string;
}

export interface ApiCandidatureForJob {
  id: number;
  job_id: number;
  candidat_id: number;
  statut: "en_attente" | "acceptee" | "refusee";
  message: string | null;
  cv: string | null;
  date_postulation: string;
  candidat_nom: string;
  candidat_email: string;
  candidat_telephone: string | null;
  candidat_ville: string | null;
}

export const candidaturesApi = {
  apply: (payload: { job_id: number; candidat_id: number; message?: string; cv?: string }) =>
    post<{ candidature: { id: number } }>("/candidatures/apply.php", payload),
  listByCandidate: (candidat_id: number, statut?: string) =>
    get<{ candidatures: ApiCandidatureCandidate[]; total: number }>(
      `/candidatures/list_by_candidate.php?candidat_id=${candidat_id}${statut && statut !== "all" ? `&statut=${statut}` : ""}`
    ),
  listByJob: (job_id: number, statut?: string) =>
    get<{ candidatures: ApiCandidatureForJob[]; total: number }>(
      `/candidatures/list_by_job.php?job_id=${job_id}${statut && statut !== "all" ? `&statut=${statut}` : ""}`
    ),
  updateStatus: (id: number, statut: "en_attente" | "acceptee" | "refusee") =>
    post<{ id: number; statut: string }>("/candidatures/update_status.php", { id, statut }),
  remove: (id: number) =>
    post<{ id: number }>("/candidatures/delete.php", { id }),
};

// ============ Admin ============
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: "candidat" | "employeur" | "admin";
  statut: "actif" | "bloque";
  telephone: string | null;
  ville: string | null;
  created_at: string;
}

export interface ApiJob {
  id: number;
  title: string;
  entreprise: string;
  secteur: string;
  lieu: string;
  salaire: string;
  horaire: string;
  statut: "active" | "en_attente" | "rejetee" | "inactive";
  created_at: string;
}

export interface ApiAdminStats {
  total_users: number;
  total_candidats: number;
  total_employeurs: number;
  total_admins: number;
  total_jobs: number;
  jobs_active: number;
  jobs_en_attente: number;
  jobs_rejetee: number;
  total_candidatures: number;
  candidatures_en_attente: number;
  candidatures_acceptee: number;
  candidatures_refusee: number;
  par_secteur: { secteur: string; count: number }[];
  inscriptions_recentes: { id: number; name: string; email: string; role: string; created_at: string }[];
  offres_en_attente: { id: number; title: string; entreprise: string; lieu: string; created_at: string }[];
}

export const adminApi = {
  stats: () => get<{ stats: ApiAdminStats }>("/admin/dashboard_stats.php"),
  users: (params: { role?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.role && params.role !== "all") q.set("role", params.role);
    if (params.search) q.set("search", params.search);
    const qs = q.toString();
    return get<{ users: ApiUser[]; total: number }>(`/admin/users_list.php${qs ? `?${qs}` : ""}`);
  },
  setUserStatus: (id: number, statut: "actif" | "bloque") =>
    post<{ id: number }>("/admin/users_update_status.php", { id, statut }),
  deleteUser: (id: number) =>
    post<{ id: number }>("/admin/users_delete.php", { id }),
  jobs: (statut?: string) =>
    get<{ jobs: ApiJob[]; total: number }>(
      `/admin/jobs_list.php${statut && statut !== "all" ? `?statut=${statut}` : ""}`
    ),
  moderateJob: (id: number, statut: "active" | "en_attente" | "rejetee" | "inactive") =>
    post<{ id: number }>("/admin/jobs_moderate.php", { id, statut }),
  deleteJob: (id: number) =>
    post<{ id: number }>("/admin/jobs_delete.php", { id }),
};
