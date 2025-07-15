import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence,
signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';


@Injectable({
providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {} // <-- Inyección clásica en el constructor

  async login(email: string, password: string): Promise<UserCredential> {
    await setPersistence(this.auth, browserSessionPersistence);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string): Promise<UserCredential> {
    await setPersistence(this.auth, browserSessionPersistence);
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    return signOut(this.auth);
  }
}
