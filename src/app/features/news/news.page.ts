import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExternalApiService } from '../../core/services/external-api.service';
import { NewsDetailModalComponent } from '../../shared/components/news-detail-modal/news-detail-modal.component';
import { NewsI } from '../../core/models/sneakers.models';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NewsPage {
  public apiService = inject(ExternalApiService);
  private modalCtrl = inject(ModalController);

  async openNewsDetail(news: NewsI) {
    const modal = await this.modalCtrl.create({
      component: NewsDetailModalComponent,
      componentProps: { news }
    });
    await modal.present();
  }
}
