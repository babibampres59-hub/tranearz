import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import Desa from './Desa';
import Penduduk from './Penduduk';
import Bantuan from './Bantuan';
import Pengumuman from './Pengumuman';
import Permohonan from './Permohonan';
import Settings from './Settings';
import KartuKeluarga from './KartuKeluarga';
import Riwayat from './Riwayat';
import Umkm from './Umkm';
import Adminduk from './Adminduk';
import SmartAssistant from './SmartAssistant';
import { LogoutIcon } from '../constants';
import Button from './ui/Button';
import { useData } from '../hooks/useMockData';


interface PageProps {
    title: string;
    children: React.ReactNode;
    onLogout: () => void;
    headerActions?: React.ReactNode;
}

export const PageLayout: React.FC<PageProps> = ({ title, children, onLogout, headerActions }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    {headerActions}
                    <Button 
                        onClick={onLogout} 
                        variant="secondary" 
                        size="sm" 
                        className="!p-2.5 sm:!px-3 sm:!py-1.5 flex items-center gap-2"
                        aria-label="Keluar"
                    >
                        <LogoutIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Keluar</span>
                    </Button>
                </div>
            </header>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { permohonan } = useData();
  const [activeView, setActiveView] = useState('desa');
  
  const hasPendingRequests = useMemo(() => permohonan.some(p => p.status === 'Menunggu'), [permohonan]);

  const renderContent = () => {
    switch (activeView) {
      case 'desa':
        return <Desa onLogout={onLogout} />;
      case 'penduduk':
        return <Penduduk onLogout={onLogout} />;
      case 'kk':
        return <KartuKeluarga onLogout={onLogout} />;
      case 'adminduk':
        return <Adminduk onLogout={onLogout} />;
      case 'umkm':
        return <Umkm onLogout={onLogout} />;
      case 'bantuan':
        return <Bantuan onLogout={onLogout} />;
      case 'pengumuman':
        return <Pengumuman onLogout={onLogout} />;
      case 'permohonan':
        return <Permohonan onLogout={onLogout} />;
      case 'riwayat':
        return <Riwayat onLogout={onLogout} />;
      case 'pengaturan':
        return <Settings onLogout={onLogout} />;
      default:
        return <Desa onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} hasPendingRequests={hasPendingRequests} />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {renderContent()}
      </main>
      <SmartAssistant />
    </div>
  );
};

export default Dashboard;