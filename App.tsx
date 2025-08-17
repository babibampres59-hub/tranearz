

import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { DataProvider, useData } from './hooks/useMockData';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { loading, error, reloadData } = useData();

  useEffect(() => {
    // Hide splash screen when data loading is finished
    if (!loading) {
      const splashScreen = document.getElementById('splash-screen');
      if (splashScreen) {
        splashScreen.classList.add('fade-out');
        // Remove from DOM after transition
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 500); // Must match CSS transition duration
      }
    }
  }, [loading]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  // While loading, the splash screen is visible. We can return null from React.
  if (loading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200">
              <h2 className="text-xl font-bold text-red-600">Gagal Memuat Data</h2>
              <p className="text-slate-600 mt-2 mb-4">{error}</p>
              <button onClick={reloadData} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors active:scale-95">
                Coba Lagi
              </button>
          </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-100">
        <AppContent />
      </div>
    </DataProvider>
  );
};

export default App;
