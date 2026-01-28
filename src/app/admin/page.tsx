'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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

    useEffect(() => {
        const isDataLoaded = !userLoading && !profileLoading;

        if (isDataLoaded) {
            if (!user) {
                // If all data is loaded and there's no user, redirect to login.
                router.push('/login');
            } else if (userProfile?.isAdmin !== true) {
                // If user is not an admin, show toast and redirect to home.
                toast({
                    variant: 'destructive',
                    title: t.accessDeniedTitle,
                    description: t.accessDeniedDescription,
                });
                router.push('/');
            }
        }
    }, [user, userProfile, userLoading, profileLoading, router, toast, t]);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            // After logout, always go to the login page.
            router.push('/login');
        }
    };

    const isLoading = userLoading || profileLoading;

    // While loading, or if the user is not yet confirmed as an admin, show a spinner.
    // This prevents any content flash. The useEffect above handles the actual redirection logic.
    if (isLoading || !userProfile?.isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    // Only render the admin content if all checks pass and the user is an admin.
    return (
        <div className="container mx-auto py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t.adminPanel}</h1>
                    <p className="text-muted-foreground">{t.welcome}, {user?.email}</p>
                </div>
                <Button onClick={handleLogout} variant="outline">{t.logout}</Button>
            </header>
            
            <main>
                <GalleryManager />
            </main>
        </div>
    );
}
