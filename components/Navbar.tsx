'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useAuth, useProfile } from '@/hooks';

const Navbar = () => {
  const { handleSignOut } = useAuth('sign-in');
  const { user } = useProfile();

  console.log({ user });

  const handleLogout = async () => {
    await handleSignOut();
  };
  return (
    <nav>
      <Link href="/" className="nav-link">
        <div className="flex justify-between gap-2 items-center">
          <div className="flex items-center gap-2">
            <Image alt="logo" src="/logo.svg" height={32} width={38} />
            <h3 className="text-primary-100">AI InterviewPro</h3>
          </div>
          {/* Mejorar el botón de cierre de sesión */}
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
          {user && (
            <div className="flex items-center gap-2">
              <p className="text-sm">Hello! {user.name}</p>
            </div>
          )}
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
