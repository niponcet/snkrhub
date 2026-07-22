import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface NewsSlide {
  tag: string;
  title: string;
  styleClass: string;
}

interface NewsCard {
  tag: string;
  title: string;
  meta: string;
  bgColor: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class HomePage implements OnInit, OnDestroy {
  readonly currentSlide = signal<number>(0);
  private intervalId: any;

  readonly slides: NewsSlide[] = [
    { tag: 'JORDAN BRAND', title: 'Air Jordan 4 "Bred Reimagined" agota stock en 6 minutos', styleClass: 's1' },
    { tag: 'STREETWEAR', title: 'Travis Scott confirma colaboración sorpresa con Nike para 2026', styleClass: 's2' },
    { tag: 'MERCADO', title: 'El precio reventa de la Yeezy 350 sube 18% esta semana', styleClass: 's3' }
  ];

  readonly newsFeed: NewsCard[] = [
    { tag: 'NIKE', title: 'Nike anuncia relanzamiento del Air Max Plus "Sunset" para agosto', meta: 'Hace 2 h · SnkrHub News', bgColor: '#2a2a30' },
    { tag: 'ADIDAS', title: 'Adidas Samba vuelve a subir en el índice de reventa por tercer mes', meta: 'Hace 5 h · Market Watch', bgColor: '#33241c' },
    { tag: 'CULTURA', title: 'Cómo la IA está cambiando la autenticación de sneakers raros', meta: 'Ayer · SnkrHub News', bgColor: '#1c2a24' },
    { tag: 'JORDAN BRAND', title: 'Filtrada la lista completa de colorways Jordan 1 Low para el Q1 2027', meta: 'Ayer · Leak Report', bgColor: '#2a2020' }
  ];

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentSlide.update(idx => (idx + 1) % this.slides.length);
    }, 4000);
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
