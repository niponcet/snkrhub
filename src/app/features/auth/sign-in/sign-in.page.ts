import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SignInPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  goBack() {
    this.router.navigate(['/welcome']);
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (this.signInForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.signInForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.isLoading.set(false);
      this.router.navigate(['/inventory']);
    } catch (error: any) {
      this.isLoading.set(false);
      
      let message = 'Ocurrió un error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Credenciales incorrectas.';
      }

      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async onGoogleSignIn() {
    try {
      this.isLoading.set(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.isLoading.set(false);
      this.router.navigate(['/inventory']);
    } catch (error) {
      this.isLoading.set(false);
      const toast = await this.toastCtrl.create({
        message: 'Error al iniciar sesión con Google.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}
