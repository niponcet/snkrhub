import { Component, OnInit, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ExternalApiService } from '../../core/services/external-api.service';
import { NewsDetailModalComponent } from '../../shared/components/news-detail-modal/news-detail-modal.component';
import { NewsI } from '../../core/models/sneakers.models';

interface NewsSlide {
  tag: string;
  title: string;
  styleClass: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class HomePage implements OnInit, OnDestroy {
  public apiService = inject(ExternalApiService);
  private modalCtrl = inject(ModalController);
  
  readonly currentSlide = signal<number>(0);
  private intervalId: any;

  readonly featuredNews = computed(() => this.apiService.news().slice(0, 3));

  ngOnInit() {
    this.apiService.fetchNews();
    
    this.intervalId = setInterval(() => {
      // Usar la longitud de featuredNews para el carrusel en lugar de un arreglo estático
      const len = this.featuredNews().length;
      if (len > 0) {
        this.currentSlide.update(idx => (idx + 1) % len);
      }
    }, 4000);
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
  }

  async openNewsDetail(news: NewsI) {
    const modal = await this.modalCtrl.create({
      component: NewsDetailModalComponent,
      componentProps: { news }
    });
    await modal.present();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
