import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExternalApiService } from '../../core/services/external-api.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CatalogPage {
  private externalApi = inject(ExternalApiService);
  readonly releases = this.externalApi.releases;
}
