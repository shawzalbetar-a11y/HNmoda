'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error(error); // Also log to console for dev visibility

      let description = 'You do not have permission to perform this action. Please check your Firestore security rules.';
      
      // Check if it's our custom detailed error
      if (error instanceof FirestorePermissionError) {
        description = `The request for the path '${error.context.path}' was denied. This is a security rule issue. Please manually update the rules in your Firebase Console as the automatic sync might have failed.`;
      } else if (error.message) {
        // For other potential errors
        description = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: description,
        duration: 10000, // Increase duration to read the detailed message
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
