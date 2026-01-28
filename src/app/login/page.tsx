'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { upsertUserProfile } from '@/firebase/firestore/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Spinner } from '@/components/ui/spinner';

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

  useEffect(() => {
    // If we're done loading the user and they exist, redirect them away.
    if (!userLoading && user) {
        router.push('/admin');
    }
  }, [user, userLoading, router]);


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
      // Try to sign in first.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure the profile exists after sign-in.
      await upsertUserProfile(firestore, userCredential.user);
    } catch (error: any) {
        // If sign-in fails because the user doesn't exist, create a new account.
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                // After creation, upsert the user profile.
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

  // If we are still checking the user's auth state, or if a user is already
  // logged in (in which case the useEffect will redirect them), show a spinner.
  // This prevents the login form from flashing for a logged-in user.
  if (userLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <Spinner className="h-8 w-8" />
        </div>
    );
  }

  // Only show the login form if loading is complete and there is no user.
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
