'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';


export function useDoc<T>(ref: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = {
            id: snapshot.id,
            ...snapshot.data(),
          } as T;
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
