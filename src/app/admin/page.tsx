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

    const isLoading = userLoading || profileLoading;

    useEffect(() => {
        // Wait until all data is loaded
        if (isLoading) {
            return;
        }

        // If not logged in, redirect to login page
        if (!user) {
            router.push('/login');
            return;
        }

        // If logged in but not an admin, show error and redirect to home
        if (userProfile?.isAdmin !== true) {
            toast({
                variant: 'destructive',
                title: t.accessDeniedTitle,
                description: t.accessDeniedDescription,
            });
            router.push('/');
        }
    }, [user, userProfile, isLoading, router, toast, t]);

    // Show a spinner while loading or if user is not yet confirmed as an admin.
    // This prevents any flash of admin content.
    if (isLoading || !user || userProfile?.isAdmin !== true) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
            router.push('/login');
        }
    };

    // Only render the admin content if the user is authorized
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
