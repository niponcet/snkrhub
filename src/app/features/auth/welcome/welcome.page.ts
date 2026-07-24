import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'snkr-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WelcomePage implements OnInit {
  private router = inject(Router);
  bars = signal<number[]>([]);

  ngOnInit() {
    // Generate random heights for the background bars as per design
    const newBars = [];
    for (let i = 0; i < 26; i++) {
      newBars.push(40 + Math.random() * 70);
    }
    this.bars.set(newBars);
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
