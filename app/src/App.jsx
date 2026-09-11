import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import PublicLayout from './pages/public/PublicLayout'
import Home from './pages/public/Home'
import HowItWorks from './pages/public/HowItWorks'
import { ForCompanies, ForTesters } from './pages/public/ForPages'
import Pricing from './pages/public/Pricing'
import FAQ from './pages/public/FAQ'
import { MentionsLegales, Confidentialite, CGU } from './pages/public/Legal'
import NotFound from './pages/public/NotFound'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import CompanyLayout from './pages/company/CompanyLayout'
import CompanyDashboard from './pages/company/Dashboard'
import Campaigns from './pages/company/Campaigns'
import CampaignDetail from './pages/company/CampaignDetail'
import NewCampaign from './pages/company/NewCampaign'
import Reports from './pages/company/Reports'
import CompanyPayments from './pages/company/Payments'
import CompanySettings from './pages/company/Settings'

import TesterLayout from './pages/tester/TesterLayout'
import TesterDashboard from './pages/tester/Dashboard'
import Missions from './pages/tester/Missions'
import MissionDetail from './pages/tester/MissionDetail'
import Feedback from './pages/tester/Feedback'
import MyMissions from './pages/tester/MyMissions'
import Earnings from './pages/tester/Earnings'
import TesterProfile from './pages/tester/Profile'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import { AdminCompanies, AdminTesters, AdminCampaigns, AdminPayments, AdminDisputes } from './pages/admin/AdminLists'
import AdminFeedbacks from './pages/admin/Feedbacks'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="comment-ca-marche" element={<HowItWorks />} />
            <Route path="entreprises" element={<ForCompanies />} />
            <Route path="testeurs" element={<ForTesters />} />
            <Route path="tarifs" element={<Pricing />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="confidentialite" element={<Confidentialite />} />
            <Route path="cgu" element={<CGU />} />
          </Route>

          <Route path="connexion" element={<Login />} />
          <Route path="inscription" element={<Register />} />
          <Route path="mot-de-passe-oublie" element={<ForgotPassword />} />

          <Route path="entreprise" element={<ProtectedRoute roles={['company']}><CompanyLayout /></ProtectedRoute>}>
            <Route index element={<CompanyDashboard />} />
            <Route path="campagnes" element={<Campaigns />} />
            <Route path="campagnes/:id" element={<CampaignDetail />} />
            <Route path="nouvelle-campagne" element={<NewCampaign />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="rapports/:id" element={<Reports />} />
            <Route path="paiements" element={<CompanyPayments />} />
            <Route path="parametres" element={<CompanySettings />} />
          </Route>

          <Route path="testeur" element={<ProtectedRoute roles={['tester']}><TesterLayout /></ProtectedRoute>}>
            <Route index element={<TesterDashboard />} />
            <Route path="missions" element={<Missions />} />
            <Route path="missions/:id" element={<MissionDetail />} />
            <Route path="missions/:id/feedback" element={<Feedback />} />
            <Route path="mes-missions" element={<MyMissions />} />
            <Route path="gains" element={<Earnings />} />
            <Route path="profil" element={<TesterProfile />} />
          </Route>

          <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="entreprises" element={<AdminCompanies />} />
            <Route path="testeurs" element={<AdminTesters />} />
            <Route path="campagnes" element={<AdminCampaigns />} />
            <Route path="feedbacks" element={<AdminFeedbacks />} />
            <Route path="paiements" element={<AdminPayments />} />
            <Route path="litiges" element={<AdminDisputes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
