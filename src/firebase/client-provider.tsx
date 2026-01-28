'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseInstances = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      value={{
        firebaseApp: firebaseInstances.firebaseApp,
        auth: firebaseInstances.auth,
        firestore: firebaseInstances.firestore,
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
