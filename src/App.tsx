import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { FamilyPage } from './pages/FamilyPage';
import { AssetsPage } from './pages/AssetsPage';
import { NomineesPage } from './pages/NomineesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FamilyPlanPage } from './pages/FamilyPlanPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ClaimDetailPage } from './pages/ClaimDetailPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { SettingsPage } from './pages/SettingsPage';

const RouteDispatcher: React.FC = () => {
  const { currentRoute } = useApp();

  switch (currentRoute) {
    case 'welcome':
      return <WelcomePage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'family':
      return <FamilyPage />;
    case 'assets':
      return <AssetsPage />;
    case 'nominees':
      return <NomineesPage />;
    case 'documents':
      return <DocumentsPage />;
    case 'family-plan':
      return <FamilyPlanPage />;
    case 'readiness':
      return <ReadinessPage />;
    case 'emergency':
      return <EmergencyPage />;
    case 'claim-detail':
      return <ClaimDetailPage />;
    case 'professionals':
      return <ProfessionalsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

export function App() {
  return (
    <AppProvider>
      <AppLayout>
        <RouteDispatcher />
      </AppLayout>
    </AppProvider>
  );
}

export default App;
