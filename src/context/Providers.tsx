// providers.tsx
'use client'
import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
};
