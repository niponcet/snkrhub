import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class ProfilePage implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userName = user.displayName || user.email?.split('@')[0] || 'Usuario';
      } else {
        this.userName = '';
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  openFacebook() {
    window.open('https://facebook.com', '_blank');
  }

  openTwitter() {
    window.open('https://twitter.com', '_blank');
  }

  openInstagram() {
    window.open('https://instagram.com', '_blank');
  }
}
