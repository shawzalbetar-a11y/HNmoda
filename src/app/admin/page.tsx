'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { useToast } from '@/hooks/use-toast';

type UserProfile = {
    isAdmin?: boolean;
};

export default function AdminPage() {
    const { user, loading: userLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language].admin;
    const { toast } = useToast();

    const userProfileRef = useMemo(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    const loading = userLoading || profileLoading;

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to login
                router.push('/login');
            } else if (userProfile?.isAdmin !== true) {
                // Logged in, but not an admin, redirect to home
                toast({
                    variant: 'destructive',
                    title: t.accessDeniedTitle,
                    description: t.accessDeniedDescription,
                });
                router.push('/');
            }
        }
    }, [user, userProfile, loading, router, toast, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (!user || userProfile?.isAdmin !== true) {
        // This is a fallback to prevent rendering the page before redirect completes
        return null;
    }

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
            router.push('/login');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t.adminPanel}</h1>
                    <p className="text-muted-foreground">{t.welcome}, {user.email}</p>
                </div>
                <Button onClick={handleLogout} variant="outline">{t.logout}</Button>
            </header>
            
            <main>
                <GalleryManager />
            </main>
        </div>
    );
}
