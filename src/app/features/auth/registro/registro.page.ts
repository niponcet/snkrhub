import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;
  cargando: boolean = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("", [Validators.required]),
      'password': new FormControl("", [Validators.required, Validators.minLength(6)]),
      'confirmacionPassword': new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {}

  async guardar() {
    const f = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor completa todos los campos requeridos (mínimo 6 caracteres para la contraseña).',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    if (f.password !== f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header: 'Contraseñas no coinciden',
        message: 'La contraseña y la confirmación no coinciden.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const email = f.nombre.includes('@') ? f.nombre : `${f.nombre.trim()}@snkrhub.com`;
    
    this.cargando = true;
    try {
      await this.authService.register(email, f.password);
      
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada exitosamente.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      let mensajeError = 'No se pudo completar el registro. Inténtalo de nuevo.';

      if (error?.code === 'auth/email-already-in-use') {
        mensajeError = 'El usuario o correo electrónico ya está registrado.';
      } else if (error?.code === 'auth/weak-password') {
        mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error?.code === 'auth/invalid-email') {
        mensajeError = 'El correo electrónico ingresado no es válido.';
      }

      const alert = await this.alertController.create({
        header: 'Error de Registro',
        message: mensajeError,
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.cargando = false;
    }
  }
}
