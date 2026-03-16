import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Offres from "./pages/Offres";
import OffreDetail from "./pages/OffreDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidatProfil from "./pages/candidat/Profil";
import CandidatCandidatures from "./pages/candidat/Candidatures";
import EmployeurDashboard from "./pages/employeur/Dashboard";
import AjouterOffre from "./pages/employeur/AjouterOffre";
import MesOffres from "./pages/employeur/MesOffres";
import EmployeurCandidatures from "./pages/employeur/Candidatures";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUtilisateurs from "./pages/admin/Utilisateurs";
import AdminOffres from "./pages/admin/Offres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/offre/:id" element={<OffreDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidat/profil" element={<CandidatProfil />} />
          <Route path="/candidat/candidatures" element={<CandidatCandidatures />} />
          <Route path="/employeur/dashboard" element={<EmployeurDashboard />} />
          <Route path="/employeur/ajouter-offre" element={<AjouterOffre />} />
          <Route path="/employeur/mes-offres" element={<MesOffres />} />
          <Route path="/employeur/candidatures" element={<EmployeurCandidatures />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="/admin/offres" element={<AdminOffres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
