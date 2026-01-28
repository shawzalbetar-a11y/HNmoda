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
        // Don't make any decisions until all data is loaded.
        if (userLoading || profileLoading) {
            return;
        }

        // After loading, if there's no user, they should be at the login page.
        if (!user) {
            router.push('/login');
            return;
        }

        // After loading, if the user is not an admin, show a toast and redirect to home.
        if (userProfile?.isAdmin !== true) {
            toast({
                variant: 'destructive',
                title: t.accessDeniedTitle,
                description: t.accessDeniedDescription,
            });
            router.push('/');
        }
    }, [user, userProfile, userLoading, profileLoading, router, toast, t]);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            router.push('/login');
        }
    };

    // This is the gatekeeper for rendering.
    // If we are loading, or if the final state is "not an admin", we show a spinner.
    // This prevents any content from flashing. The useEffect will handle the redirect.
    if (userLoading || profileLoading || !userProfile?.isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    // Only render the admin content if all checks pass.
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
