'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextValue;
}) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  if (context.firebaseApp === null) {
      throw new Error('Firebase app not initialized');
  }
  return context.firebaseApp;
}

export function useAuth() {
    const context = useFirebase();
    if (context.auth === null) {
        throw new Error('Firebase Auth not initialized');
    }
    return context.auth;
}

export function useFirestore() {
    const context = useFirebase();
    if (context.firestore === null) {
        throw new Error('Firebase Firestore not initialized');
    }
    return context.firestore;
}
