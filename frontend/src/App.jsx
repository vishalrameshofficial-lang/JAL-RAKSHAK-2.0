import React, { useState } from 'react';
import { WaterProvider } from './context/WaterContext';
import Layout from './components/layout/Layout';
import SaaSLanding from './pages/SaaSLanding';
import LandingLogin from './pages/LandingLogin';
import Overview from './pages/Overview';
import LiveMonitoring from './pages/LiveMonitoring';
import WaterQuality from './pages/WaterQuality';
import HistoricalData from './pages/HistoricalData';
import AlertsPage from './pages/AlertsPage';
import DeviceStatus from './pages/DeviceStatus';
import StationMap from './pages/StationMap';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  // App flow: SaaS Landing → Login → Dashboard
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [activePage, setActivePage] = useState('overview');

  // Show the SaaS marketing landing page
  if (view === 'landing') {
    return (
      <SaaSLanding
        onEnterDashboard={() => setView('login')}
      />
    );
  }

  // Show the telemetry login portal
  if (view === 'login') {
    return (
      <LandingLogin
        onLogin={() => setView('dashboard')}
        onBack={() => setView('landing')}
      />
    );
  }

  // Main dashboard
  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return <Overview setActivePage={setActivePage} />;
      case 'live':
        return <LiveMonitoring />;
      case 'quality':
        return <WaterQuality />;
      case 'history':
        return <HistoricalData />;
      case 'alerts':
        return <AlertsPage />;
      case 'device':
        return <DeviceStatus />;
      case 'map':
        return <StationMap />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Overview setActivePage={setActivePage} />;
    }
  };

  return (
    <WaterProvider>
      <Layout
        activePage={activePage}
        setActivePage={setActivePage}
        onSignOut={() => setView('landing')}
      >
        {renderContent()}
      </Layout>
    </WaterProvider>
  );
}
