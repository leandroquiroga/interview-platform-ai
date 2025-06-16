import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
