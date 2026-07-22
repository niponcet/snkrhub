import { inject, Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { SneakerI } from '../models/sneakers.models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SneakerService {
  private firestoreService = inject(FirestoreService);

  /**
   * Signal privado reactivo con la lista completa de zapatillas.
   */
  private sneakersSignal = signal<SneakerI[]>([]);

  /**
   * Signals reactivos para término de búsqueda y filtro de marca.
   */
  readonly searchTerm = signal<string>('');
  readonly brandFilter = signal<string>('All');

  /**
   * Signal público de solo lectura con todas las zapatillas.
   */
  readonly sneakers = this.sneakersSignal.asReadonly();

  /**
   * Signal computado con la cantidad total de zapatillas.
   */
  readonly totalSneakers = computed(() => this.sneakersSignal().length);

  /**
   * Signal computado que calcula el valor total estimado de la colección (suma de marketValue / precio).
   */
  readonly totalCollectionValue = computed(() => {
    return this.sneakersSignal().reduce((sum, item) => {
      const val = Number(item.marketValue || item.precio || 0);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  });

  /**
   * Signal computado con las marcas únicas disponibles en la colección para dinámicamente poblar filtros.
   */
  readonly availableBrands = computed(() => {
    const brands = new Set<string>();
    brands.add('All');
    this.sneakersSignal().forEach(item => {
      const b = item.brand || item.marca;
      if (b && b.trim()) {
        brands.add(b.trim());
      }
    });
    return Array.from(brands);
  });

  /**
   * Signal computado que aplica los filtros de búsqueda y marca de forma reactiva.
   */
  readonly filteredSneakers = computed(() => {
    const all = this.sneakersSignal();
    const term = this.searchTerm().trim().toLowerCase();
    const selectedBrand = this.brandFilter();

    return all.filter(sneaker => {
      // 1. Filtrar por Marca
      const sneakerBrand = (sneaker.brand || sneaker.marca || '').trim();
      const matchesBrand =
        selectedBrand === 'All' ||
        sneakerBrand.toLowerCase() === selectedBrand.toLowerCase();

      // 2. Filtrar por Término de Búsqueda (Modelo, Marca o Descripción)
      const sneakerModel = (sneaker.model || sneaker.modelo || '').toLowerCase();
      const sneakerDesc = (sneaker.description || sneaker.descripcion || '').toLowerCase();
      const matchesSearch =
        !term ||
        sneakerModel.includes(term) ||
        sneakerBrand.toLowerCase().includes(term) ||
        sneakerDesc.includes(term);

      return matchesBrand && matchesSearch;
    });
  });

  constructor() {
    this.loadSneakers();
  }

  /**
   * Carga la colección de zapatillas desde Firestore y actualiza el Signal.
   */
  async loadSneakers(): Promise<SneakerI[]> {
    try {
      const data = await firstValueFrom(
        this.firestoreService.getCollectionChanges<SneakerI>('Sneakers')
      );
      if (data) {
        this.sneakersSignal.set(data);
      }
      return data || [];
    } catch (error) {
      console.error('Error al cargar zapatillas desde Firestore:', error);
      return [];
    }
  }

  /**
   * Establece el término de búsqueda.
   */
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  /**
   * Establece el filtro de marca.
   */
  setBrandFilter(brand: string) {
    this.brandFilter.set(brand);
  }

  /**
   * Agrega una nueva zapatilla a Firestore y actualiza el Signal.
   */
  async addSneaker(sneaker: SneakerI): Promise<void> {
    const docId = sneaker.id || this.firestoreService.createIdDoc();
    const newSneaker: SneakerI = { ...sneaker, id: docId };

    await this.firestoreService.createDocumentID(newSneaker, 'Sneakers', docId);
    this.sneakersSignal.update(current => [...current, newSneaker]);
  }

  /**
   * Actualiza una zapatilla existente y refresca el Signal.
   */
  async updateSneaker(id: string, updatedData: Partial<SneakerI>): Promise<void> {
    await this.firestoreService.updateDocumentID(updatedData, 'Sneakers', id);
    this.sneakersSignal.update(current =>
      current.map(item => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  /**
   * Elimina una zapatilla de Firestore y actualiza el Signal.
   */
  async removeSneaker(id: string): Promise<void> {
    await this.firestoreService.deleteDocumentID('Sneakers', id);
    this.sneakersSignal.update(current => current.filter(item => item.id !== id));
  }
}
