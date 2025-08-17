

import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import Logo from './Logo';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  hasPendingRequests: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, hasPendingRequests }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col group w-20 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r border-slate-200/80 p-3">
        <div className="h-20 flex items-center justify-center flex-shrink-0">
             <Logo className="w-12 h-12 transform group-hover:rotate-12 transition-transform" />
        </div>
        <nav className="flex-1 space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
            <a
                key={item.name}
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveView(item.view); }}
                className={`flex items-center h-12 rounded-xl transition-colors duration-200 overflow-hidden ${
                activeView === item.view
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={item.name}
            >
                <div className="relative w-20 h-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6" />
                    {item.view === 'permohonan' && hasPendingRequests && (
                        <span className={`absolute top-3 right-3 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ${activeView === item.view ? 'ring-blue-600' : 'ring-white'}`}></span>
                    )}
                </div>
                <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.name}
                </span>
            </a>
            ))}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 z-20">
        <div className="flex justify-around">
            {NAVIGATION_ITEMS.map(item => (
                <a 
                    href="#" 
                    key={item.view} 
                    onClick={(e) => { e.preventDefault(); setActiveView(item.view); }}
                    className={`flex flex-col items-center flex-grow py-3 transition-colors duration-200 ${activeView === item.view ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-100'}`}
                    aria-label={item.name}
                >
                    <div className="relative">
                        <item.icon className="w-6 h-6 mb-1" />
                        {item.view === 'permohonan' && hasPendingRequests && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform translate-x-1/4 -translate-y-1/4 rounded-full bg-red-500 ring-2 ring-white"></span>
                        )}
                    </div>
                    <span className="text-xs font-medium">{item.name.split(' ')[0]}</span>
                </a>
            ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;