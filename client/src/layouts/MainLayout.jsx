import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7] text-[#1E3F20]">
      <Navbar />
      <main className="agri-page-enter flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
