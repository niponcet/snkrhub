import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { SneakerService } from '../../core/services/sneaker.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private sneakerService = inject(SneakerService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  isAuthenticated: boolean = false;
  userName: string = 'Nicolás M.';
  userHandle: string = 'nicolas.snkr';
  userInitials: string = 'NM';
  collectorId: string = 'SNKR-000482';

  readonly totalSneakers = this.sneakerService.totalSneakers;
  readonly totalCollectionValue = this.sneakerService.totalCollectionValue;
  readonly favoritesCount = computed(() => {
    return this.sneakerService.sneakers().filter(s => s.isFavorite).length;
  });

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || 'Usuario Snkr';
        this.userName = name;
        this.userHandle = (user.email?.split('@')[0] || 'collector').toLowerCase() + '.snkr';
        const parts = name.trim().split(' ');
        this.userInitials = parts.length > 1 
          ? (parts[0][0] + parts[1][0]).toUpperCase() 
          : name.substring(0, 2).toUpperCase();
        this.collectorId = 'SNKR-' + (user.uid.substring(0, 6).toUpperCase() || '000482');
      } else {
        this.userName = 'Nicolás M.';
        this.userHandle = 'nicolas.snkr';
        this.userInitials = 'NM';
        this.collectorId = 'SNKR-000482';
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      const toast = await this.toastController.create({
        message: 'Has cerrado sesión correctamente.',
        duration: 2000,
        color: 'dark',
        position: 'bottom'
      });
      await toast.present();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  onSettingClick(title: string) {
    console.log('Configuración seleccionada:', title);
  }
}
