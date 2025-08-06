'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MenuBar from './MenuBar';

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full">
      <Link href="/" className="nav-link">
        <div className="flex justify-between gap-2 items-center">
          <div className="flex items-center gap-2">
            <Image alt="logo" src="/logo.svg" height={32} width={38} />
            <h3 className="text-primary-100">AI InterviewPro</h3>
          </div>
        </div>
      </Link>
      <MenuBar />
    </nav>
  );
};

export default Navbar;
