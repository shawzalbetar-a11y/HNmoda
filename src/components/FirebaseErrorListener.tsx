'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error(error); // Also log to console for dev visibility
      toast({
        variant: 'destructive',
        title: 'Permission Error',
        description: 'You do not have permission to perform this action.',
        duration: 5000,
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
