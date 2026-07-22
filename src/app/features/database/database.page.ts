import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExternalApiService } from '../../core/services/external-api.service';
import { HistoricalSneakerI } from '../../core/models/sneakers.models';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatabasePage {
  private externalApi = inject(ExternalApiService);

  readonly searchTerm = signal<string>('');
  readonly activeBrand = signal<string>('Todos');
  readonly brands = signal<string[]>(['Todos', 'Nike', 'Jordan', 'Adidas']);

  readonly historicalSneakers = this.externalApi.historicalSneakers;

  readonly filteredSneakers = computed(() => {
    const all = this.historicalSneakers();
    const term = this.searchTerm().toLowerCase().trim();
    const brand = this.activeBrand();

    return all.filter(item => {
      const matchesBrand = brand === 'Todos' || item.brand.toLowerCase() === brand.toLowerCase();
      const matchesSearch = !term || item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
      return matchesBrand && matchesSearch;
    });
  });

  setBrand(brand: string) {
    this.activeBrand.set(brand);
  }

  onSearchChange(event: any) {
    const val = event.target?.value || event.detail?.value || '';
    this.searchTerm.set(val);
  }
}
