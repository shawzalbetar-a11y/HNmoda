'use client';

import {
    addDoc,
    collection,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type GalleryItemData = {
    name: string;
    url: string;
    category: 'models' | 'collections' | 'products';
    type: 'image' | 'video';
};

export const addGalleryItem = (firestore: Firestore, data: GalleryItemData) => {
    const galleryCollection = collection(firestore, 'gallery');
    return addDoc(galleryCollection, {
        ...data,
        createdAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: galleryCollection.path,
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError; // re-throw to be caught by the calling function
    });
};

export const updateGalleryItem = (firestore: Firestore, id: string, data: Partial<GalleryItemData>) => {
    const itemDoc = doc(firestore, 'gallery', id);
    return updateDoc(itemDoc, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: itemDoc.path,
            operation: 'update',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });
};

export const deleteGalleryItem = (firestore: Firestore, id: string) => {
    const itemDoc = doc(firestore, 'gallery', id);
    return deleteDoc(itemDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: itemDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });
};
