import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7] text-[#1E3F20]">
      <Navbar />
      <div className="agri-dashboard-shell mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="agri-page-enter flex-1 overflow-x-hidden rounded-3xl border border-[#4E3629]/15 bg-[#FAF6EE] p-6 shadow-sm md:ml-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
