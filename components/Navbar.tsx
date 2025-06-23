import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav>
      <Link href="/" className="nav-link">
        <div className="flex gap-2 items-center">
          <Image alt="logo" src="/logo.svg" height={32} width={38} />
          <h3 className="text-primary-100">AI InterviewPro</h3>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
