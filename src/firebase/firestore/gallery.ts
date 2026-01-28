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
    imageUrl2?: string;
    imageUrl3?: string;
    imageUrl4?: string;
    videoUrl?: string;
    category: 'models' | 'collections' | 'products';
    itemType: string;
    season: 'Spring/Summer' | 'Fall/Winter' | 'All-Season';
    inventoryStatus: 'available' | 'sold out';
    description?: string;
    price?: number;
};

export const addGalleryItem = (firestore: Firestore, data: GalleryItemData) => {
    const galleryCollection = collection(firestore, 'gallery');
    addDoc(galleryCollection, {
        ...data,
        createdAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: galleryCollection.path,
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};

export const updateGalleryItem = (firestore: Firestore, id: string, data: Partial<GalleryItemData>) => {
    const itemDoc = doc(firestore, 'gallery', id);
    updateDoc(itemDoc, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: itemDoc.path,
            operation: 'update',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};

export const deleteGalleryItem = (firestore: Firestore, id: string) => {
    const itemDoc = doc(firestore, 'gallery', id);
    deleteDoc(itemDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: itemDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
};
