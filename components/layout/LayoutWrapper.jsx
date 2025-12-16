'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingContactDial from '@/components/layout/FloatingContactDial';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if current route is admin
  const isAdminRoute = pathname?.startsWith('/admin');

  // Admin routes - no navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes - with navbar/footer
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingContactDial />
    </>
  );
}