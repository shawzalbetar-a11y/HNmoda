'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore, useUser, useDoc } from '@/firebase';
import { upsertUserProfile } from '@/firebase/firestore/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Spinner } from '@/components/ui/spinner';
import { doc } from 'firebase/firestore';

type UserProfile = {
    isAdmin?: boolean;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].admin;

  const { user, loading: userLoading } = useUser();

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

    // After loading, if a user is logged in, redirect them.
    if (user) {
      if (userProfile?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, userProfile, userLoading, profileLoading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!auth || !firestore) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Firebase not initialized correctly.',
        });
        setIsSubmitting(false);
        return;
    };
    try {
      // First, try to sign in.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await upsertUserProfile(firestore, userCredential.user);
    } catch (error: any) {
        // If sign-in fails because the user doesn't exist or credentials are wrong,
        // try to create a new user account.
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                await upsertUserProfile(firestore, newUserCredential.user);
                toast({
                    title: t.accountCreatedTitle,
                    description: t.accountCreatedDescription,
                });
            } catch (creationError: any) {
                // If account creation also fails (e.g., weak password), show that error.
                toast({
                    variant: 'destructive',
                    title: t.loginErrorTitle,
                    description: creationError.message,
                });
            }
        } else {
            // For any other sign-in errors (e.g., network issue), show the original error.
            toast({
                variant: 'destructive',
                title: t.loginErrorTitle,
                description: error.message,
            });
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  // If we are checking the user's auth state, or if the user is already
  // logged in (in which case the useEffect will redirect them), show a spinner.
  if (userLoading || profileLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <Spinner className="h-8 w-8" />
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.loginTitle}</CardTitle>
          <CardDescription>{t.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t.loggingIn : t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
