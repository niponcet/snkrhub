import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { NewsI } from '../../../core/models/sneakers.models';
import { addIcons } from 'ionicons';
import { closeOutline, openOutline } from 'ionicons/icons';

@Component({
  selector: 'app-news-detail-modal',
  templateUrl: './news-detail-modal.component.html',
  styleUrls: ['./news-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NewsDetailModalComponent {
  @Input() news!: NewsI;
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ closeOutline, openOutline });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  openExternal() {
    if (this.news?.articleUrl) {
      window.open(this.news.articleUrl, '_blank');
    }
  }
}
