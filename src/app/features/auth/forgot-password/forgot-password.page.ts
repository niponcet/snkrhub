import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = signal<boolean>(false);
  isEmailSent = signal<boolean>(false);

  goBack() {
    this.router.navigate(['/sign-in']);
  }

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);
    const { email } = this.forgotPasswordForm.value;

    try {
      await sendPasswordResetEmail(this.auth, email);
      this.isLoading.set(false);
      this.isEmailSent.set(true);
    } catch (error: any) {
      this.isLoading.set(false);
      
      let message = 'Ocurrió un error al enviar el enlace.';
      if (error.code === 'auth/user-not-found') {
        message = 'No hay ningún usuario con este correo.';
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
