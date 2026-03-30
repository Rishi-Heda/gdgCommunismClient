import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background-base text-text-primary overflow-x-hidden animate-fade-in selection:bg-accent-primary selection:text-background-base">
      <div className="noise" />
      <Sidebar />
      <div className="flex flex-col md:ml-64 min-h-screen">
        <Topbar />
        <main className="flex-1 pt-16 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
