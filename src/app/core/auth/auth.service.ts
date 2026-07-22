import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  authState, 
  User, 
  UserCredential 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  /**
   * Observable que emite los cambios en el estado del usuario autenticado.
   */
  readonly user$: Observable<User | null> = authState(this.auth);

  /**
   * Obtiene el usuario actual logueado o null.
   */
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Inicia sesión con email y contraseña en Firebase Auth.
   */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Registra un nuevo usuario con email y contraseña en Firebase Auth.
   */
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Cierra la sesión activa del usuario.
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
