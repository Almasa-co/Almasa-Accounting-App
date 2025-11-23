'use client';
import { AuthProvider } from '@/lib/auth';
import { LanguageProvider } from '@/lib/i18n';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <AuthProvider>
                {children}
                <Toaster position="top-right" />
            </AuthProvider>
        </LanguageProvider>
    );
}
