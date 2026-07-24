import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SignUpPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  signUpForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue]
  });

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  goBack() {
    this.router.navigate(['/welcome']);
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleTerms() {
    const current = this.signUpForm.get('terms')?.value;
    this.signUpForm.get('terms')?.setValue(!current);
  }

  async onSubmit() {
    if (this.signUpForm.invalid) return;

    this.isLoading.set(true);
    const { name, email, password } = this.signUpForm.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update the user profile with the name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      this.isLoading.set(false);
      this.router.navigate(['/inventory']);
    } catch (error: any) {
      this.isLoading.set(false);
      
      let message = 'Ocurrió un error al crear la cuenta.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'El email ya está registrado.';
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
}
