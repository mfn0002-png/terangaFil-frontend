'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Masquer la Navbar et le Footer pour toutes les pages commençant par /auth ou /dashboard
  const isExcludedPage = pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard');

  if (isExcludedPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
