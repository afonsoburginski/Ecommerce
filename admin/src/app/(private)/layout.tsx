// src/app/(private)/layout.tsx
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import AuthWrapper from '@/components/auth/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className={inter.className}>
        <AuthWrapper>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-grow h-full pl-14">
              <Header />
              <main className="h-full">{children}</main>
            </div>
          </div>
        </AuthWrapper>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
