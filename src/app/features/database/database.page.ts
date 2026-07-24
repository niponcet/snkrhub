import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExternalApiService } from '../../core/services/external-api.service';
import { HistoricalSneakerI } from '../../core/models/sneakers.models';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatabasePage implements OnInit {
  public apiService = inject(ExternalApiService);

  constructor() {
    addIcons({ searchOutline });
  }

  readonly isLoading = signal<boolean>(false);
  readonly activeBrand = signal<string>('Jordan');
  readonly brands = signal<string[]>(['Todos', 'Nike', 'Jordan', 'Adidas', 'Yeezy']);

  async ngOnInit() {
    await this.performSearch('', this.activeBrand());
  }

  async onSearch(event: any) {
    const term = event.target?.value || event.detail?.value || '';
    if (!term && this.activeBrand() === 'Todos') {
      this.apiService.searchResults.set([]);
      return;
    }
    await this.performSearch(term, this.activeBrand() === 'Todos' ? '' : this.activeBrand());
  }

  async setBrand(brand: string) {
    this.activeBrand.set(brand);
    // Trigger search when brand changes (optionally without query if we just want brand drops)
    const searchbar = document.querySelector('ion-searchbar');
    const term = searchbar ? searchbar.value || '' : '';
    await this.performSearch(term, brand === 'Todos' ? '' : brand);
  }

  private async performSearch(query: string, brand: string) {
    this.isLoading.set(true);
    try {
      await this.apiService.searchSneakers(query, brand);
    } finally {
      this.isLoading.set(false);
    }
  }
}
