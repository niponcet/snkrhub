import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;
  showWelcome: boolean = false;
  welcomeMessage: string = '';
  cargando: boolean = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", [Validators.required]),
      'password': new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {}

  async ingresar() {
    if (this.formularioLogin.invalid) {
      const alert = await this.alertController.create({
        header: 'Campos requeridos',
        message: 'Por favor completa todos los campos para ingresar.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const f = this.formularioLogin.value;
    const email = f.nombre.includes('@') ? f.nombre : `${f.nombre.trim()}@snkrhub.com`;
    
    this.cargando = true;
    try {
      const userCredential = await this.authService.login(email, f.password);
      const displayName = userCredential.user.email?.split('@')[0] || f.nombre;
      
      this.welcomeMessage = `¡Bienvenido, ${displayName}!`;
      this.showWelcome = true;

      setTimeout(() => {
        this.showWelcome = false;
        this.router.navigate(['/home']);
      }, 1500);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      let mensajeError = 'Error al iniciar sesión. Por favor verifica tus credenciales.';
      
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        mensajeError = 'Usuario o contraseña incorrectos.';
      } else if (error?.code === 'auth/invalid-email') {
        mensajeError = 'El formato del correo electrónico no es válido.';
      }

      const alert = await this.alertController.create({
        header: 'Error de Autenticación',
        message: mensajeError,
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.cargando = false;
    }
  }
}
