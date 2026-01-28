'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
    if (!userLoading && user) {
        // User is already logged in, redirect them away from login page.
        // Redirect to admin, the admin page will handle non-admin redirection to home.
        router.push('/admin');
    }
  }, [user, userLoading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!auth || !firestore) {
        setIsSubmitting(false);
        return;
    };
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      upsertUserProfile(firestore, userCredential.user);

      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t.loginErrorTitle,
        description: error.message,
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  // While checking auth status or if user is already logged in, show a loader.
  // This prevents the login form from flashing for logged-in users before redirecting.
  if (userLoading || user) {
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
