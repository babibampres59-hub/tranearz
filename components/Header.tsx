
import React from 'react';
import Button from './ui/Button';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between h-16 px-6 lg:px-8 bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-slate-800">Selamat Datang, Admin!</h2>
      <div>
        <Button onClick={onLogout} variant="secondary">
          Keluar
        </Button>
      </div>
    </header>
  );
};

export default Header;