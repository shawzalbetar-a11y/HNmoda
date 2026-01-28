'use client';

import { doc, setDoc, Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type UserProfileData = {
    email: string | null;
};

// Creates or updates a user's profile document in Firestore.
export const upsertUserProfile = (firestore: Firestore, user: User) => {
    if (!user) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    const userData: UserProfileData = {
        email: user.email,
    };
    
    // Using setDoc with { merge: true } ensures we don't overwrite existing fields
    // like 'isAdmin' when a user logs in. It will create the document if it doesn't exist.
    setDoc(userDocRef, userData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};
