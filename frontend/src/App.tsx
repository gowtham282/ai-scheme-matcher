import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FindSchemesPage } from './pages/FindSchemesPage';
import { SmartMatcherPage } from './pages/SmartMatcherPage';
import { SchemeResultsPage } from './pages/SchemeResultsPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { RequiredDocumentsPage } from './pages/RequiredDocumentsPage';
import { HowToApplyPage } from './pages/HowToApplyPage';
import { PartnerFinderPage } from './pages/PartnerFinderPage';
import { TrackingPage } from './pages/TrackingPage';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SourcesPage } from './pages/SourcesPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsDisclaimerPage } from './pages/TermsDisclaimerPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/schemes" element={<FindSchemesPage />} />
                  <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                  <Route path="/smart-matcher" element={<SmartMatcherPage />} />
                  <Route path="/results" element={<SchemeResultsPage />} />
                  <Route path="/eligibility" element={<EligibilityCheckerPage />} />
                  <Route path="/documents" element={<RequiredDocumentsPage />} />
                  <Route path="/how-to-apply" element={<HowToApplyPage />} />
                  <Route path="/partners" element={<PartnerFinderPage />} />
                  <Route path="/tracking" element={<TrackingPage />} />
                  <Route path="/saved" element={<SavedSchemesPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/sources" element={<SourcesPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-disclaimer" element={<TermsDisclaimerPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
