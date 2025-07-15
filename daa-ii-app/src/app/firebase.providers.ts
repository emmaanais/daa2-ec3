import { importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
// Agrega otros providers si usas Firestore/Storage/etc



export const firebaseProviders = [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    // Ejemplo si usas Firestore:
    // provideFirestore(() => getFirestore()),
    // provideStorage(() => getStorage())

];
