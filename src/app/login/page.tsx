'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { upsertUserProfile } from '@/firebase/firestore/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore(); // Get firestore instance
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].admin;


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!auth || !firestore) {
        setLoading(false);
        return;
    };
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // On successful login, create/update the user's profile document.
      upsertUserProfile(firestore, userCredential.user);

      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t.loginErrorTitle,
        description: error.message,
      });
    } finally {
        setLoading(false);
    }
  };

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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loggingIn : t.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
